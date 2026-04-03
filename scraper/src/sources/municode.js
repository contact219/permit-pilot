import { chromium } from 'playwright';
import { db } from '../shared/db.js';
import { jurisdictions, permitTypes } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';

export async function scrapeMunicode(jurisdictionId) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    // Get jurisdiction from DB
    const [jur] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
    if (!jur) throw new Error('Jurisdiction not found');

    const portalUrl = jur.portalUrl;
    await page.goto(portalUrl, { waitUntil: 'networkidle' });

    // Mock scraping - replace with actual selectors per municipal site
    const permits = await page.$$eval('.permit-item, .permit-type, .permit', items => items.map(item => ({
      name: item.querySelector('.name, .title, h3')?.innerText?.trim() || 'Unknown',
      code: item.getAttribute('data-code') || item.id?.replace('permit-', '') || 'UNKNOWN',
      feeBase: parseFloat(item.getAttribute('data-fee-base') || item.querySelector('.fee-base, .fee')?.innerText?.replace(/[^0-9.]/g, '')) || 0,
      feePerSqft: parseFloat(item.getAttribute('data-fee-per-sqft') || item.querySelector('.fee-per-sqft')?.innerText?.replace(/[^0-9.]/g, '')) || 0,
      requiredDocs: Array.from(item.querySelectorAll('.required-doc, .docs li, .requirements li')).map(doc => ({
        name: doc.querySelector('.doc-name')?.innerText?.trim() || doc.innerText?.substring(0, 50) || 'Document',
        description: doc.querySelector('.doc-desc')?.innerText?.trim() || '',
      })),
    }));

    for (const permit of permits) {
      const existing = await db.select().from(permitTypes).where(and(
        eq(permitTypes.jurisdictionId, jurisdictionId),
        eq(permitTypes.code, permit.code)
      ));
      if (existing.length > 0) {
        await db.update(permitTypes).set(permit).where(eq(permitTypes.id, existing[0].id));
      } else {
        await db.insert(permitTypes).values({ ...permit, jurisdictionId });
      }
    }

    return { jurisdictionId, permitsAdded: permits.length, status: 'completed' };
  } catch (error) {
    return { jurisdictionId, status: 'failed', error: error.message };
  } finally {
    await browser.close();
  }
}
