import { db } from '../db.js';
import { jurisdictions, permitTypes } from '../../../db/schema.js';
import { eq, ilike, and } from 'drizzle-orm';

export async function findJurisdiction(query: string, state?: string) {
  if (state) {
    return db.select().from(jurisdictions).where(and(ilike(jurisdictions.name, `%${query}%`), eq(jurisdictions.state, state))).limit(10);
  }
  return db.select().from(jurisdictions).where(ilike(jurisdictions.name, `%${query}%`)).limit(10);
}

export async function getJurisdictionWithPermits(jurisdictionId: string) {
  const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId)).limit(1);
  const permits = await db.select().from(permitTypes).where(eq(permitTypes.jurisdictionId, jurisdictionId));
  return { ...jurisdiction, permitTypes: permits };
}
