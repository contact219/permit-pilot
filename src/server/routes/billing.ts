import { Router } from 'express';
import express from 'express';
import { db } from '../db.js';
import { users, projects } from '../../../db/schema.js';
import { eq, count } from 'drizzle-orm';
import { createCheckoutSession, createCustomerPortalSession, handleWebhook } from '../services/stripe.js';

const router = Router();
const requireAuth = (req: any, res: any, next: any) => { if (!req.user) return res.status(401).json({ error: 'Unauthorized' }); next(); };

const getFrontendUrl = (req: any) => {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL;
  const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
  return `${protocol}://${req.headers.host}`;
};

router.post('/checkout', requireAuth, async (req: any, res: any) => {
  try {
    const { planTier } = req.body;
    if (!['contractor', 'agency'].includes(planTier)) return res.status(400).json({ error: 'Invalid plan tier' });
    const session = await createCheckoutSession(req.user.id, req.user.email, planTier, getFrontendUrl(req));
    res.json({ sessionId: session.id, url: session.url });
  } catch (e: any) { console.error('Checkout error:', e); res.status(500).json({ error: e.message || 'Failed to create checkout session' }); }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req: any, res: any) => {
  try {
    const result = await handleWebhook(req.body as Buffer, req.headers['stripe-signature'] as string);
    res.json(result);
  } catch (e: any) { console.error('Webhook error:', e); res.status(400).json({ error: 'Webhook handling failed' }); }
});

router.get('/portal', requireAuth, async (req: any, res: any) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    if (!user?.stripeCustomerId) return res.status(404).json({ error: 'No subscription found. Please upgrade first.' });
    const session = await createCustomerPortalSession(user.stripeCustomerId, getFrontendUrl(req));
    res.json({ url: session.url });
  } catch (e: any) { console.error('Portal error:', e); res.status(500).json({ error: 'Failed to create portal session' }); }
});

// Check plan limits before creating a project
router.get('/limits', requireAuth, async (req: any, res: any) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    const planTier = user?.planTier || 'free';
    if (planTier !== 'free') return res.json({ allowed: true, planTier });

    const [result] = await db.select({ count: count() }).from(projects).where(eq(projects.userId, req.user.id));
    const projectCount = Number(result?.count || 0);
    const allowed = projectCount < 2;
    res.json({ allowed, planTier, projectCount, limit: 2 });
  } catch (e) { res.status(500).json({ error: 'Failed to check limits' }); }
});

export default router;
