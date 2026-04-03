import { chromium } from 'playwright';
import { db } from '../shared/db.js';
import { jurisdictions, permitTypes } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';

function deriveCode(name) {
  const lower = name.toLowerCase();
  if (lower.includes('electrical') || lower.includes('electric')) return 'ELEC';
  if (lower.includes('plumbing')) return 'PLMB';
  if (lower.includes('mechanical') || lower.includes('hvac')) return 'MECH';
  if (lower.includes('pool') || lower.includes('swimming')) return 'POOL';
  if (lower.includes('fence')) return 'FENCE';
  if (lower.includes('demolition')) return 'DEMO';
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

  const citySlug = jur.city.toLowerCase().replace(/\s+/g, '-');
  const url = 'https://library.municode.com/tx/' + citySlug;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Municode: scraping ' + jur.name + ' at ' + url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const title = await page.title();
    if (title.includes('404') || title.includes('not found')) {
      return { jurisdictionId, status: 'skipped', message: 'No Municode entry for ' + jur.name };
    }

    const sections = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links
        .filter(a => a.textContent && (a.textContent.toLowerCase().includes('permit') || a.textContent.toLowerCase().includes('building')))
        .slice(0, 20)
        .map(a => ({ name: a.textContent.trim().substring(0, 100) }));
    });

    let permitsUpserted = 0;
    for (const section of sections) {
      if (!section.name || section.name.length < 5) continue;
      const code = deriveCode(section.name);
      const existing = await db.select().from(permitTypes).where(and(eq(permitTypes.jurisdictionId, jurisdictionId), eq(permitTypes.code, code)));
      if (existing.length === 0) {
        await db.insert(permitTypes).values({ jurisdictionId, name: section.name, code, notes: 'Source: Municode' });
        permitsUpserted++;
      }
    }
    return { jurisdictionId, city: jur.name, permitsUpserted, status: 'completed' };
  } catch (error) {
    console.error('Municode error for ' + jur.name + ':', error.message);
    return { jurisdictionId, status: 'failed', error: error.message };
  } finally {
    await browser.close();
  }
}