import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const raw = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        client_reference_id?: string | null;
        metadata?: { session_id?: string };
        customer?: string | null;
        subscription?: string | null;
      };
      const sessionId = session.client_reference_id || session.metadata?.session_id;
      if (sessionId) {
        await supabase
          .from("subscriptions")
          .update({
            plan: "premium",
            status: "active",
            stripe_customer_id: session.customer || null,
            stripe_subscription_id: session.subscription || null,
            updated_at: new Date().toISOString(),
          })
          .eq("session_id", sessionId);
      }
    }

    if (
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.updated"
    ) {
      const sub = event.data.object as {
        id: string;
        status?: string;
        customer?: string;
      };
      const premium = sub.status === "active" || sub.status === "trialing";
      await supabase
        .from("subscriptions")
        .update({
          plan: premium ? "premium" : "expired",
          status: premium ? "active" : "expired",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", sub.id);
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
