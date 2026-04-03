import { db } from '../shared/db.js';
import { jurisdictions, permitTypes } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';

const DATASETS = {
  'Dallas, TX': [{ host: 'www.dallasopendata.com', dataset: 'e7gq-4sah' }],
  'Fort Worth, TX': [{ host: 'data.fortworthtexas.gov', dataset: 'yc37-5a73' }],
  'Arlington, TX': [{ host: 'opendata.arlingtontx.gov', dataset: 'xjjr-2xdm' }],
};

function deriveCode(name) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('electrical') || lower.includes('electric')) return 'ELEC';
  if (lower.includes('plumbing') || lower.includes('plumb')) return 'PLMB';
  if (lower.includes('mechanical') || lower.includes('hvac')) return 'MECH';
  if (lower.includes('pool') || lower.includes('swimming')) return 'POOL';
  if (lower.includes('fence')) return 'FENCE';
  if (lower.includes('demolition') || lower.includes('demo')) return 'DEMO';
  if (lower.includes('sign')) return 'SIGN';
  if (lower.includes('roof')) return 'ROOF';
  if (lower.includes('gas')) return 'GAS';
  if (lower.includes('fire')) return 'FIRE';
  if (lower.includes('commercial')) return 'COMM';
  if (lower.includes('residential') || lower.includes('building') || lower.includes('addition')) return 'BLDG';
  return null;
}

export async function scrapeSocrata(jurisdictionId) {
  const rows = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
  const jur = rows[0];
  if (!jur) return { jurisdictionId, status: 'skipped', message: 'Jurisdiction not found' };

  const configs = DATASETS[jur.name];
  if (!configs) return { jurisdictionId, status: 'skipped', message: 'No Socrata dataset for ' + jur.name };

  let totalUpserted = 0;
  for (const config of configs) {
    try {
      const url = 'https://' + config.host + '/resource/' + config.dataset + '.json?$limit=500';
      console.log('Socrata: fetching ' + jur.name + ' from ' + url);
      const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) { console.error('Socrata HTTP ' + res.status); continue; }

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) continue;

      const seen = new Set();
      for (const item of data) {
        const candidates = [item.permit_type, item.permitType, item.permit_subtype, item.work_type, item.type, item.description].filter(Boolean);
        for (const raw of candidates) {
          const name = String(raw).trim();
          if (!name || name.length < 3 || seen.has(name)) continue;
          seen.add(name);
          const code = deriveCode(name);
          if (!code) continue;
          const existing = await db.select().from(permitTypes).where(and(eq(permitTypes.jurisdictionId, jurisdictionId), eq(permitTypes.code, code)));
          if (existing.length === 0) {
            await db.insert(permitTypes).values({ jurisdictionId, name: name.substring(0, 200), code, notes: 'Source: Socrata - ' + config.host });
            totalUpserted++;
          }
        }
      }
    } catch (error) {
      console.error('Socrata error for ' + jur.name + ':', error.message);
    }
  }
  return { jurisdictionId, city: jur.name, permitsUpserted: totalUpserted, status: 'completed' };
}
