import * as cheerio from 'cheerio';
import { db } from '../shared/db.js';
import { jurisdictions, permitTypes } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; PermitPilot/1.0)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const FEE_SCHEDULE_URLS = {
  'Allen, TX': 'https://www.cityofallen.org/893/Building-and-Permitting',
  'Frisco, TX': 'https://www.friscotexas.gov/395/Building-Inspections',
  'McKinney, TX': 'https://www.mckinneytexas.org/243/Building-Inspections',
  'Plano, TX': 'https://www.plano.gov/350/Building-Inspections-Permits',
  'Wylie, TX': 'https://www.wylietexas.gov/departments/building_inspection/index.php',
  'Fort Worth, TX': 'https://www.fortworthtexas.gov/departments/development-services/permits',
  'Dallas, TX': 'https://dallascityhall.com/departments/sustainabledevelopment/buildinginspection/pages/residential.aspx',
  'Arlington, TX': 'https://www.arlingtontx.gov/City-Services/Permits',
  'Denton, TX': 'https://www.cityofdenton.com/622/Residential-Permits',
  'Mansfield, TX': 'https://www.mansfieldtexas.gov/271/Building-Permits',
  'Grapevine, TX': 'https://www.grapevinetexas.gov/136/Applications-Permits',
  'Flower Mound, TX': 'https://www.flowermound.gov/170/Building-Information-and-Permits',
  'Coppell, TX': 'https://www.coppelltx.gov/211/Permits',
  'Euless, TX': 'https://www.eulesstx.gov/departments/planning-and-economic-development/building-construction-and-permitting',
  'Grand Prairie, TX': 'https://www.gptx.org/Departments/Building-Inspections/Residential-Information',
  'Haltom City, TX': 'https://www.haltomcitytx.com/278/Planning-Inspections---Forms-and-Permits',
  'Hurst, TX': 'https://www.hursttx.gov/about-us/departments/community-development/building-inspections/building-permit-information',
  'North Richland Hills, TX': 'https://www.nrhtx.com/103/Building-Inspections-Permits',
  'Pantego, TX': 'https://www.townofpantego.com/permits',
  'Richland Hills, TX': 'https://www.richlandhills.com/268/Forms-Permits-Fees',
  'Watauga, TX': 'https://www.cowtx.org/1147/Permits',
  'Westlake, TX': 'https://westlake-tx.org/147/Applications-Forms-Fees',
  'Bedford, TX': 'https://bedfordtx.gov/176/Building-Inspections',
  'Dalworthington Gardens, TX': 'https://www.cityofdwg.net/permits-inspections-and-zoning',
};

function extractFormLinks($, baseUrl) {
  const links = [];
  const seen = new Set();
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    let fullUrl;
    try { fullUrl = new URL(href, baseUrl).href; } catch { return; }
    if (seen.has(fullUrl) || !fullUrl.startsWith('http')) return;
    const lowerHref = fullUrl.toLowerCase();
    const lowerText = text.toLowerCase();
    if (lowerHref.includes('.pdf') || lowerText.includes('application') || lowerText.includes('form') ||
        lowerText.includes('permit') || lowerHref.includes('form') || lowerHref.includes('application')) {
      seen.add(fullUrl);
      links.push({ href: fullUrl, text });
    }
  });
  return links.slice(0, 40);
}

function matchFormToPermit(formLinks, permitName) {
  const keywords = permitName.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  return formLinks
    .filter(link => keywords.some(kw => (link.text + ' ' + link.href).toLowerCase().includes(kw)))
    .map(l => l.href)
    .slice(0, 3);
}

export async function scrapeCityPortals(jurisdictionId) {
  const rows = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
  const jur = rows[0];
  if (!jur) return { jurisdictionId, status: 'skipped', message: 'Jurisdiction not found' };

  const url = FEE_SCHEDULE_URLS[jur.name] || jur.portalUrl;
  if (!url) return { jurisdictionId, status: 'skipped', message: 'No URL for ' + jur.name };

  try {
    console.log('City portal: fetching ' + jur.name + ' at ' + url);
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
    if (!res.ok) return { jurisdictionId, status: 'failed', error: 'HTTP ' + res.status };

    const html = await res.text();
    const $ = cheerio.load(html);
    $('nav, footer, header, script, style').remove();

    const formLinks = extractFormLinks($, url);
    const feeMatches = ($.text().match(/\$[\d,]+(\.[\d]{2})?/g) || []).slice(0, 20);

    const existingPermits = await db.select().from(permitTypes).where(eq(permitTypes.jurisdictionId, jurisdictionId));
    let formsAttached = 0;
    for (const permit of existingPermits) {
      const matched = matchFormToPermit(formLinks, permit.name);
      if (matched.length > 0) {
        const merged = [...new Set([...(permit.formUrls || []), ...matched])].slice(0, 5);
        await db.update(permitTypes).set({ formUrls: merged }).where(eq(permitTypes.id, permit.id));
        formsAttached++;
      }
    }

    await db.update(jurisdictions).set({ lastVerified: new Date(), verifiedBy: 'scraper' }).where(eq(jurisdictions.id, jurisdictionId));
    return { jurisdictionId, city: jur.name, formLinksFound: formLinks.length, formsAttached, feesFound: feeMatches.length, status: 'completed' };
  } catch (error) {
    console.error('City portal error for ' + jur.name + ':', error.message);
    return { jurisdictionId, status: 'failed', error: error.message };
  }
}
