import { Router } from 'express';
import { db } from '../../db.js';
import { users } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { projects, projectPermits, inspectionReminders } from '../../../../db/schema.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const router = Router();
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

// GET all users
router.get('/', requireAdmin, async (_: any, res: any) => {
  try {
    const rows = await db.select({
      id: users.id, email: users.email, role: users.role,
      companyName: users.companyName, planTier: users.planTier,
      stripeCustomerId: users.stripeCustomerId, emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    }).from(users).orderBy(users.createdAt);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: 'Failed to fetch users' }); }
});

// POST create user
router.post('/', requireAdmin, async (req: any, res: any) => {
  try {
    const { email, password, role = 'contractor', companyName, planTier = 'free' } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) return res.status(409).json({ error: 'Email already exists' });

    const tempPassword = password || crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const [newUser] = await db.insert(users).values({
      email, passwordHash, role, companyName, planTier,
      emailVerified: true, // admin-created users skip verification
    }).returning({
      id: users.id, email: users.email, role: users.role,
      companyName: users.companyName, planTier: users.planTier,
      emailVerified: users.emailVerified, createdAt: users.createdAt,
    });

    res.status(201).json({ user: newUser, tempPassword: password ? undefined : tempPassword });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to create user' }); }
});

// PATCH update user
router.patch('/:id', requireAdmin, async (req: any, res: any) => {
  try {
    const { role, planTier, stripeCustomerId, companyName, emailVerified, password } = req.body;
    const updates: any = {};
    if (role !== undefined) updates.role = role;
    if (planTier !== undefined) updates.planTier = planTier;
    if (stripeCustomerId !== undefined) updates.stripeCustomerId = stripeCustomerId;
    if (companyName !== undefined) updates.companyName = companyName;
    if (emailVerified !== undefined) updates.emailVerified = emailVerified;
    if (password) updates.passwordHash = await bcrypt.hash(password, 10);

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'Nothing to update' });

    const [updated] = await db.update(users).set(updates).where(eq(users.id, req.params.id)).returning();
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: 'Failed to update user' }); }
});

// DELETE user (cascades projects/permits)
router.delete('/:id', requireAdmin, async (req: any, res: any) => {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ error: 'Cannot delete your own account' });

    const userId = req.params.id;

    // Get all projects for this user
    const userProjects = await db.select({ id: projects.id }).from(projects).where(eq(projects.userId, userId));
    const projectIds = userProjects.map(p => p.id);

    // Delete project permits for each project
    for (const projectId of projectIds) {
      await db.delete(projectPermits).where(eq(projectPermits.projectId, projectId));
    }

    // Delete inspection reminders
    await db.delete(inspectionReminders).where(eq(inspectionReminders.userId, userId));

    // Delete projects
    await db.delete(projects).where(eq(projects.userId, userId));

    // Delete user
    const deleted = await db.delete(users).where(eq(users.id, userId)).returning({ id: users.id });
    if (deleted.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ ok: true });
  } catch (e) { console.error('Delete user error:', e); res.status(500).json({ error: 'Failed to delete user' }); }
});

export default router;
