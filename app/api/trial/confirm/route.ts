export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.trimtrack.fit";

  if (!token || !sessionId) {
    return NextResponse.redirect(`${appUrl}/?error=invalid`);
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("confirm_token", token)
    .eq("session_id", sessionId)
    .single();

  if (!data) return NextResponse.redirect(`${appUrl}/?error=invalid`);

  await supabase.from("subscriptions").update({
    email_confirmed: true,
    confirm_token: null,
    status: "active",
    updated_at: new Date().toISOString(),
  }).eq("session_id", sessionId);

  const response = NextResponse.redirect(`${appUrl}/dashboard?trial=confirmed`);
  response.cookies.set("trimtrack_session", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}