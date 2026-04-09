export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const sessionId = session.metadata?.sessionId;
    if (sessionId) {
      await supabase.from("subscriptions").upsert({
        session_id: sessionId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        plan: "premium",
        status: "active",
        updated_at: new Date().toISOString(),
      }, { onConflict: "session_id" });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as any;
    await supabase.from("subscriptions")
      .update({ plan: "free", status: "cancelled", updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", sub.id);
  }

  return NextResponse.json({ received: true });
}