import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-11-20.acacia',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, quantity } = req.body as { planId: string; quantity: number };

    // Validations: Must be at least 100
    if (!quantity || isNaN(quantity) || quantity < 100) {
      return res.status(400).json({ error: 'Minimum quantity is 100' });
    }

    // Map your frontend IDs to your Stripe Price IDs
    const priceMap: Record<string, string | undefined> = {
      'LETTER': process.env.STRIPE_PRICE_LETTER,
      'POSTCARD_STD': process.env.STRIPE_PRICE_POSTCARD_STD,
      'POSTCARD_JUMBO': process.env.STRIPE_PRICE_POSTCARD_JUMBO,
    };

    // Find the matching price ID (case-insensitive)
    const normalizedId = String(planId).toUpperCase();
    const price = priceMap[normalizedId];

    if (!price) {
      console.error(`Price ID missing for plan: ${planId}`);
      return res.status(400).json({ error: `Price ID configuration missing for: ${planId}` });
    }

    // Create the Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price,
          quantity: Math.trunc(quantity),
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}


