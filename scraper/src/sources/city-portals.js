import { chromium } from 'playwright';
import { db } from '../shared/db.js';
import { jurisdictions, permitTypes } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

export async function scrapeCityPortals(jurisdictionId) {
  const rows = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
  const jur = rows[0];
  if (!jur || !jur.portalUrl) return { jurisdictionId, status: 'skipped', message: 'No portal URL' };

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('City portal: scraping ' + jur.name + ' at ' + jur.portalUrl);
    await page.goto(jur.portalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const formLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'));
      return links
        .filter(a => {
          const h = a.href.toLowerCase();
          const t = a.textContent.toLowerCase();
          return h.includes('.pdf') || t.includes('application') || t.includes('form') || t.includes('permit');
        })
        .map(a => ({ href: a.href, text: a.textContent.trim() }))
        .slice(0, 30);
    });

    const existingPermits = await db.select().from(permitTypes).where(eq(permitTypes.jurisdictionId, jurisdictionId));
    let formsAttached = 0;

    for (const permit of existingPermits) {
      const keyword = permit.name.toLowerCase().split(' ')[0];
      const matched = formLinks
        .filter(l => l.text.toLowerCase().includes(keyword) || l.href.toLowerCase().includes(keyword))
        .map(l => l.href)
        .slice(0, 3);
      if (matched.length > 0) {
        await db.update(permitTypes).set({ formUrls: matched }).where(eq(permitTypes.id, permit.id));
        formsAttached++;
      }
    }

    await db.update(jurisdictions).set({ lastVerified: new Date(), verifiedBy: 'scraper' }).where(eq(jurisdictions.id, jurisdictionId));
    return { jurisdictionId, city: jur.name, formLinksFound: formLinks.length, formsAttached, status: 'completed' };
  } catch (error) {
    return { jurisdictionId, status: 'failed', error: error.message };
  } finally {
    await browser.close();
  }
}