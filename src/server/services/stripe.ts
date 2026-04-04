import Stripe from 'stripe';
import { db } from '../db.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function createCheckoutSession(
  userId: string,
  email: string,
  planTier: 'contractor' | 'agency',
  frontendUrl: string
) {
  const priceId = planTier === 'contractor'
    ? process.env.STRIPE_PRICE_CONTRACTOR
    : process.env.STRIPE_PRICE_AGENCY;

  if (!priceId) throw new Error('Price ID not configured for plan: ' + planTier);

  return stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${frontendUrl}/dashboard?success=true`,
    cancel_url: `${frontendUrl}/dashboard?canceled=true`,
    metadata: { userId, planTier },
    subscription_data: { metadata: { userId, planTier } },
  });
}

export async function createCustomerPortalSession(customerId: string, frontendUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${frontendUrl}/dashboard`,
  });
}

async function updateUserPlan(userId: string, planTier: string, stripeCustomerId?: string) {
  const update: any = { planTier };
  if (stripeCustomerId) update.stripeCustomerId = stripeCustomerId;
  await db.update(users).set(update).where(eq(users.id, userId));
  console.log(`Updated user ${userId} to plan ${planTier}`);
}

export async function handleWebhook(rawBody: Buffer, signature: string): Promise<any> {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  console.log('Stripe webhook:', event.type);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planTier = session.metadata?.planTier || 'contractor';
      const customerId = session.customer as string;
      if (userId) await updateUserPlan(userId, planTier, customerId);
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;
      const status = sub.status;
      if (status === 'active') {
        const planTier = sub.metadata?.planTier || 'contractor';
        await updateUserPlan(userId, planTier, sub.customer as string);
      } else if (['canceled', 'unpaid', 'past_due'].includes(status)) {
        await updateUserPlan(userId, 'free');
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) await updateUserPlan(userId, 'free');
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object as any;
      const userId = invoice.subscription_details?.metadata?.userId || invoice.metadata?.userId;
      if (userId) console.log(`Invoice paid for user ${userId}`);
      break;
    }
    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return { received: true };
}
