import { Router } from 'express';
import { db } from '../../db.js';
import { jurisdictions, permitTypes } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();
const requireAdmin = (req: any, res: any, next: any) => { if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' }); next(); };

router.get('/', requireAdmin, async (_: any, res: any) => {
  try { res.json(await db.select().from(jurisdictions).orderBy(jurisdictions.name)); } catch (e) { res.status(500).json({ error: 'Failed to fetch jurisdictions' }); }
});
router.post('/', requireAdmin, async (req: any, res: any) => {
  try { const [j] = await db.insert(jurisdictions).values(req.body).returning(); res.status(201).json(j); } catch (e) { res.status(500).json({ error: 'Failed to create jurisdiction' }); }
});
router.patch('/:id', requireAdmin, async (req: any, res: any) => {
  try { const [u] = await db.update(jurisdictions).set(req.body).where(eq(jurisdictions.id, req.params.id)).returning(); if (!u) return res.status(404).json({ error: 'Not found' }); res.json(u); } catch (e) { res.status(500).json({ error: 'Failed to update' }); }
});
router.delete('/:id', requireAdmin, async (req: any, res: any) => {
  try { const d = await db.delete(jurisdictions).where(eq(jurisdictions.id, req.params.id)).returning({ id: jurisdictions.id }); if (!d.length) return res.status(404).json({ error: 'Not found' }); res.json({ ok: true }); } catch (e) { res.status(500).json({ error: 'Failed to delete' }); }
});
router.get('/:id/permit-types', requireAdmin, async (req: any, res: any) => {
  try { res.json(await db.select().from(permitTypes).where(eq(permitTypes.jurisdictionId, req.params.id))); } catch (e) { res.status(500).json({ error: 'Failed to fetch permit types' }); }
});
router.post('/:id/permit-types', requireAdmin, async (req: any, res: any) => {
  try { const [p] = await db.insert(permitTypes).values({ ...req.body, jurisdictionId: req.params.id }).returning(); res.status(201).json(p); } catch (e) { res.status(500).json({ error: 'Failed to create permit type' }); }
});
router.patch('/permit-types/:id', requireAdmin, async (req: any, res: any) => {
  try { const [u] = await db.update(permitTypes).set(req.body).where(eq(permitTypes.id, req.params.id)).returning(); if (!u) return res.status(404).json({ error: 'Not found' }); res.json(u); } catch (e) { res.status(500).json({ error: 'Failed to update permit type' }); }
});
router.delete('/permit-types/:id', requireAdmin, async (req: any, res: any) => {
  try { const d = await db.delete(permitTypes).where(eq(permitTypes.id, req.params.id)).returning({ id: permitTypes.id }); if (!d.length) return res.status(404).json({ error: 'Not found' }); res.json({ ok: true }); } catch (e) { res.status(500).json({ error: 'Failed to delete permit type' }); }
});

export default router;
