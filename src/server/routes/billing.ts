import { Router } from 'express';
import express from 'express';
import { db } from '../db.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { createCheckoutSession, createCustomerPortalSession, handleWebhook } from '../services/stripe.js';

const router = Router();
const requireAuth = (req: any, res: any, next: any) => { if (!req.user) return res.status(401).json({ error: 'Unauthorized' }); next(); };

router.post('/checkout', requireAuth, async (req: any, res: any) => {
  try {
    const { planTier } = req.body;
    if (!['contractor', 'homeowner'].includes(planTier)) return res.status(400).json({ error: 'Invalid plan tier' });
    const session = await createCheckoutSession(req.user.id, req.user.email, planTier);
    res.json({ sessionId: session.id, url: session.url });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to create checkout session' }); }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req: any, res: any) => {
  try {
    const result = await handleWebhook(req.body as Buffer, req.headers['stripe-signature'] as string);
    res.json(result);
  } catch (e) { res.status(400).json({ error: 'Webhook handling failed' }); }
});

router.get('/portal', requireAuth, async (req: any, res: any) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    if (!user?.stripeCustomerId) return res.status(404).json({ error: 'No subscription found' });
    const session = await createCustomerPortalSession(user.stripeCustomerId);
    res.json({ url: session.url });
  } catch (e) { res.status(500).json({ error: 'Failed to create portal session' }); }
});

export default router;
