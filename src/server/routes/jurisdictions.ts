import { Router } from 'express';
import { geocodeAddress, getPlacesAutocomplete } from '../services/geocoding.js';
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

// Address autocomplete
router.get('/autocomplete', async (req: any, res: any) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.length < 3) return res.json([]);
    const results = await getPlacesAutocomplete(q);
    res.json(results);
  } catch (e: any) { console.error('Autocomplete error:', e.message); res.json([]); }
});

// Geocode address + detect jurisdiction
router.get('/geocode', async (req: any, res: any) => {
  try {
    const { address } = req.query;
    if (!address || typeof address !== 'string') return res.status(400).json({ error: 'Address required' });

    const geocoded = await geocodeAddress(address);
    if (!geocoded) return res.json({ found: false });

    // Find matching jurisdiction in DB
    let jurisdiction = null;
    if (geocoded.jurisdictionName) {
      const { db } = await import('../db.js');
      const { jurisdictions } = await import('../../../db/schema.js');
      const { eq } = await import('drizzle-orm');
      const [jur] = await db.select().from(jurisdictions).where(eq(jurisdictions.name, geocoded.jurisdictionName));
      jurisdiction = jur || null;
    }

    res.json({ found: true, ...geocoded, jurisdiction });
  } catch (e: any) { console.error('Geocode error:', e.message); res.status(500).json({ error: 'Geocoding failed' }); }
});

export default router;
