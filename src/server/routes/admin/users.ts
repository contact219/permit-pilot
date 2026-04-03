import { Router } from 'express';
import { db } from '../../db.js';
import { users } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();
const requireAdmin = (req: any, res: any, next: any) => { if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' }); next(); };

router.get('/', requireAdmin, async (_: any, res: any) => {
  try { res.json(await db.select().from(users).orderBy(users.createdAt)); } catch (e) { res.status(500).json({ error: 'Failed to fetch users' }); }
});

router.patch('/:id', requireAdmin, async (req: any, res: any) => {
  try {
    const { role, planTier, stripeCustomerId } = req.body;
    const updates: any = {};
    if (role) updates.role = role;
    if (planTier) updates.planTier = planTier;
    if (stripeCustomerId !== undefined) updates.stripeCustomerId = stripeCustomerId;
    const [updated] = await db.update(users).set(updates).where(eq(users.id, req.params.id)).returning();
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: 'Failed to update user' }); }
});

export default router;
