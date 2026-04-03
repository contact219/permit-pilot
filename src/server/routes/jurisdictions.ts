import { Router } from 'express';
import { db } from '../db.js';
import { jurisdictions, permitTypes } from '../../../db/schema.js';
import { eq, ilike, asc, and } from 'drizzle-orm';

const router = Router();

router.get('/search', async (req: any, res: any) => {
  try {
    const { q, state } = req.query;
    if (!q || typeof q !== 'string') return res.status(400).json({ error: 'Query parameter q is required' });
    const results = state && typeof state === 'string'
      ? await db.select().from(jurisdictions).where(and(ilike(jurisdictions.name, `%${q}%`), ilike(jurisdictions.state, `%${state}%`))).orderBy(asc(jurisdictions.name)).limit(10)
      : await db.select().from(jurisdictions).where(ilike(jurisdictions.name, `%${q}%`)).orderBy(asc(jurisdictions.name)).limit(10);
    res.json(results);
  } catch (e) { res.status(500).json({ error: 'Search failed' }); }
});

router.get('/:id', async (req: any, res: any) => {
  try {
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, req.params.id));
    if (!jurisdiction) return res.status(404).json({ error: 'Jurisdiction not found' });
    const list = await db.select().from(permitTypes).where(eq(permitTypes.jurisdictionId, req.params.id));
    res.json({ ...jurisdiction, permitTypes: list });
  } catch (e) { res.status(500).json({ error: 'Failed to fetch jurisdiction' }); }
});

export default router;
