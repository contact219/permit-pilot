import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession(userId: string, email: string, planTier: 'contractor' | 'homeowner') {
  const priceId = planTier === 'contractor' ? process.env.STRIPE_PRICE_CONTRACTOR : process.env.STRIPE_PRICE_HOMEOWNER;
  return stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
    metadata: { userId },
  });
}

export async function createCustomerPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${process.env.FRONTEND_URL}/dashboard` });
}

export async function handleWebhook(rawBody: Buffer, signature: string): Promise<any> {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case 'checkout.session.completed':
    case 'customer.subscription.updated':
    case 'invoice.paid': {
      const obj = event.data.object as any;
      if (obj.metadata?.userId) console.log(`Processing ${event.type} for user ${obj.metadata.userId}`);
      break;
    }
    default: console.log(`Unhandled event: ${event.type}`);
  }
  return { received: true };
}
