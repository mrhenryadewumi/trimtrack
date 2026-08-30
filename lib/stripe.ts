import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

export function stripePriceIds() {
  const monthly =
    process.env.STRIPE_PRICE_MONTHLY ||
    process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ||
    "";
  const annual =
    process.env.STRIPE_PRICE_ANNUAL ||
    process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID ||
    "";
  return { monthly, annual };
}
