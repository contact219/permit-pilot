import * as cheerio from 'cheerio';
import { db } from '../shared/db.js';
import { jurisdictions, permitTypes } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; PermitPilot/1.0)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

function deriveCode(name) {
  const lower = name.toLowerCase();
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
  return 'BLDG';
}

export async function scrapeMunicode(jurisdictionId) {
  const rows = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
  const jur = rows[0];
  if (!jur) return { jurisdictionId, status: 'skipped', message: 'Jurisdiction not found' };

  const citySlug = (jur.city || jur.name.split(',')[0]).toLowerCase().replace(/\s+/g, '-');
  const url = 'https://library.municode.com/tx/' + citySlug;

  try {
    console.log('Municode: fetching ' + jur.name + ' at ' + url);
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
    if (!res.ok) return { jurisdictionId, status: 'skipped', message: 'HTTP ' + res.status };

    const html = await res.text();
    const $ = cheerio.load(html);

    const pageTitle = $('h1').first().text().trim();
    if (pageTitle.toLowerCase().includes('not found') || pageTitle.toLowerCase().includes('404')) {
      return { jurisdictionId, status: 'skipped', message: 'No Municode entry for ' + jur.name };
    }

    const sections = [];
    $('a').each((_, el) => {
      const text = $(el).text().trim();
      const lower = text.toLowerCase();
      if (text.length > 5 && text.length < 150 &&
          (lower.includes('permit') || lower.includes('building') ||
           lower.includes('construct') || lower.includes('inspection'))) {
        sections.push(text);
      }
    });

    let permitsUpserted = 0;
    const seen = new Set();
    for (const name of sections) {
      const code = deriveCode(name);
      if (seen.has(code)) continue;
      seen.add(code);
      const existing = await db.select().from(permitTypes).where(
        and(eq(permitTypes.jurisdictionId, jurisdictionId), eq(permitTypes.code, code))
      );
      if (existing.length === 0) {
        await db.insert(permitTypes).values({ jurisdictionId, name: name.substring(0, 200), code, notes: 'Source: Municode - ' + url });
        permitsUpserted++;
      }
    }
    return { jurisdictionId, city: jur.name, sectionsFound: sections.length, permitsUpserted, status: 'completed' };
  } catch (error) {
    console.error('Municode error for ' + jur.name + ':', error.message);
    return { jurisdictionId, status: 'failed', error: error.message };
  }
}
