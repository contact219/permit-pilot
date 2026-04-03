import { db } from '../shared/db.js';
import { jurisdictions, permitTypes } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';

export async function scrapeSocrata(jurisdictionId) {
  try {
    const [jur] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
    if (!jur) throw new Error('Jurisdiction not found');

    // Example Socrata open data endpoint (Dallas, Fort Worth, etc.)
    // In practice, you'd configure specific dataset IDs per jurisdiction
    const datasets = {
      'Dallas': 'qq2h-uv8h', // example dataset ID
      'Fort Worth': 'k6ic-7j7p',
    };
    const dataset = datasets[jur.city];
    if (!dataset) return { jurisdictionId, status: 'skipped', message: 'No Socrata dataset configured' };

    const response = await fetch(`https://data.cityofdallas.com/resource/${dataset}.json?$limit=1000`);
    const data = await response.json();

    // Transform to permit types (simplified mapping)
    const permits = data.map(item => ({
      name: item.permit_type || item.permitType || 'Unknown Permit',
      code: (item.permit_code || item.permitCode || 'UNK').toUpperCase(),
      feeBase: parseFloat(item.fee_base || item.feeBase || 0),
      feePerSqft: parseFloat(item.fee_per_sqft || item.feePerSqft || 0),
      requiredDocs: item.required_documents ? JSON.parse(item.required_documents) : [],
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
  }
}
