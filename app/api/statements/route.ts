export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const cookieSession = req.cookies.get("trimtrack_session")?.value;
    const sessionId = cookieSession || req.nextUrl.searchParams.get("session_id");
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "30");

    if (!sessionId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    let query = supabase
      .from("food_statements")
      .select("*")
      .eq("session_id", sessionId)
      .order("date", { ascending: false })
      .limit(limit);

    if (from) query = query.gte("date", from);
    if (to) query = query.lte("date", to);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ statements: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
