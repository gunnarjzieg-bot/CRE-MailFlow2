import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function getBaseUrl(req: VercelRequest) {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  const origin = req.headers.origin;
  if (typeof origin === 'string' && origin.startsWith('http')) {
    return origin;
  }

  return 'http://localhost:5173';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, quantity } = req.body as {
      planId?: string;
      quantity?: number | string;
    };

    const normalizedId = String(planId || '').toUpperCase();
    const qty = Math.trunc(Number(quantity));

    if (!normalizedId) {
      return res.status(400).json({ error: 'Missing planId' });
    }

    if (!Number.isFinite(qty) || qty < 100) {
      return res.status(400).json({ error: 'Minimum quantity is 100' });
    }

    const priceMap: Record<string, string | undefined> = {
      LETTER: process.env.STRIPE_PRICE_LETTER,
      POSTCARD_STD: process.env.STRIPE_PRICE_POSTCARD_STD,
      POSTCARD_JUMBO: process.env.STRIPE_PRICE_POSTCARD_JUMBO,
    };

    const priceId = priceMap[normalizedId];
    if (!priceId) {
      return res
        .status(400)
        .json({ error: `Price ID missing for plan: ${normalizedId}` });
    }

    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: qty }],
      success_url: `${baseUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}