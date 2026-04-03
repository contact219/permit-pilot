import { chromium } from 'playwright';
import { db } from '../shared/db.js';
import { jurisdictions, permitTypes } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';

export async function scrapeCityPortals(jurisdictionId) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    const [jur] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
    if (!jur) throw new Error('Jurisdiction not found');

    const portalUrl = jur.portalUrl;
    await page.goto(portalUrl, { waitUntil: 'networkidle' });

    // Navigate to permit application section (this would be customized per city)
    // For Frisco, we could go directly to building permits page
    if (portalUrl.includes('friscotexas.gov')) {
      await page.goto('https://www.friscotexas.gov/1489/Building-Permits', { waitUntil: 'networkidle' });
    }

    // Extract form URLs for downloadable permit applications
    const formLinks = await page.$$eval('a[href*="pdf"], a[href*="PDF"], a[href*="application"], a[href*="Application"], a[href*="form"], a[href*="Form"]', links => {
      return Array.from(new Set(links.map(a => a.href).filter(h => h && (h.includes('.pdf') || h.includes('/form') || h.includes('/application'))))).slice(0, 20);
    });

    // If we found form URLs, attach them to appropriate permit types
    if (formLinks.length > 0) {
      const existingPermits = await db.select().from(permitTypes).where(eq(permitTypes.jurisdictionId, jurisdictionId));
      for (const permit of existingPermits) {
        // Heuristic: match permit name to form link keywords
        const matchedLinks = formLinks.filter(link => 
          link.toLowerCase().includes(permit.name.toLowerCase().split(' ')[0].toLowerCase())
        ).slice(0, 3); // up to 3 forms per permit
        
        if (matchedLinks.length > 0) {
          await db.update(permitTypes)
            .set({ formUrls: matchedLinks })
            .where(eq(permitTypes.id, permit.id));
        }
      }
    }

    return { jurisdictionId, formLinksFound: formLinks.length, status: 'completed' };
  } catch (error) {
    return { jurisdictionId, status: 'failed', error: error.message };
  } finally {
    await browser.close();
  }
}
