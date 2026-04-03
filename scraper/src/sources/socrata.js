import { db } from '../shared/db.js';
import { jurisdictions, permitTypes } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';

const DATASETS = {
  'Dallas, TX': { host: 'www.dallasopendata.com', dataset: 'e7gq-4sah' },
  'Fort Worth, TX': { host: 'data.fortworthtexas.gov', dataset: 'permits' },
};

function deriveCode(name) {
  const lower = name.toLowerCase();
  if (lower.includes('electrical') || lower.includes('electric')) return 'ELEC';
  if (lower.includes('plumbing')) return 'PLMB';
  if (lower.includes('mechanical') || lower.includes('hvac')) return 'MECH';
  if (lower.includes('pool')) return 'POOL';
  if (lower.includes('fence')) return 'FENCE';
  if (lower.includes('demolition')) return 'DEMO';
  if (lower.includes('sign')) return 'SIGN';
  if (lower.includes('roof')) return 'ROOF';
  if (lower.includes('gas')) return 'GAS';
  return 'BLDG';
}

export async function scrapeSocrata(jurisdictionId) {
  const rows = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
  const jur = rows[0];
  if (!jur) return { jurisdictionId, status: 'skipped', message: 'Jurisdiction not found' };

  const config = DATASETS[jur.name];
  if (!config) return { jurisdictionId, status: 'skipped', message: 'No Socrata dataset for ' + jur.name };

  try {
    const url = 'https://' + config.host + '/resource/' + config.dataset + '.json?$limit=200';
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) return { jurisdictionId, status: 'failed', error: 'HTTP ' + response.status };
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return { jurisdictionId, status: 'skipped', message: 'No data' };

    const seen = new Set();
    let permitsUpserted = 0;
    for (const item of data) {
      const name = item.permit_type || item.permitType || item.type;
      if (!name || seen.has(name)) continue;
      seen.add(name);
      const code = deriveCode(name);
      const existing = await db.select().from(permitTypes).where(and(eq(permitTypes.jurisdictionId, jurisdictionId), eq(permitTypes.code, code)));
      if (existing.length === 0) {
        await db.insert(permitTypes).values({ jurisdictionId, name: name.substring(0, 200), code, notes: 'Source: Socrata' });
        permitsUpserted++;
      }
    }
    return { jurisdictionId, city: jur.name, permitsUpserted, status: 'completed' };
  } catch (error) {
    return { jurisdictionId, status: 'failed', error: error.message };
  }
}