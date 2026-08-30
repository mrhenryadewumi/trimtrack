import { NextRequest, NextResponse } from "next/server";
import { getStripe, stripePriceIds } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const prices = stripePriceIds();

  if (!stripe || (!prices.monthly && !prices.annual)) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 503 }
    );
  }

  const sessionId = req.cookies.get("trimtrack_session")?.value;
  if (!sessionId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({} as { plan?: string; priceId?: string }));
  const allowed = [prices.monthly, prices.annual].filter(Boolean);

  let priceId = body.plan === "annual" ? prices.annual : prices.monthly;
  if (typeof body.priceId === "string" && allowed.includes(body.priceId)) {
    priceId = body.priceId;
  }
  if (!priceId) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.trimtrack.fit";
  const plan = priceId === prices.annual ? "annual" : "monthly";

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?upgraded=1`,
      cancel_url: `${appUrl}/upgrade`,
      client_reference_id: sessionId,
      metadata: { session_id: sessionId, plan },
      allow_promotion_codes: true,
    });

    if (!checkout.url) {
      return NextResponse.json({ error: "Checkout error" }, { status: 500 });
    }

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Checkout error" }, { status: 500 });
  }
}
