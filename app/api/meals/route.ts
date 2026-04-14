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
    const querySession = req.nextUrl.searchParams.get("session_id");
    const sessionId = cookieSession || querySession;
    const date = req.nextUrl.searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!sessionId) return NextResponse.json({ error: "Missing session" }, { status: 400 });

    const { data, error } = await supabase
      .from("meal_entries")
      .select("*")
      .eq("session_id", sessionId)
      .eq("date", date);

    if (error) throw error;
    return NextResponse.json({ meals: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieSession = req.cookies.get("trimtrack_session")?.value;
    const body = await req.json();
    const sessionId = cookieSession || body.session_id;

    if (!sessionId) return NextResponse.json({ error: "Missing session" }, { status: 400 });

    const { data, error } = await supabase
      .from("meal_entries")
      .insert({
        session_id: sessionId,
        date: new Date().toISOString().split("T")[0],
        meal_type: body.meal_type,
        food_name: body.food_name,
        kcal: body.kcal,
        protein: body.protein,
        carbs: body.carbs,
        fat: body.fat,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { error } = await supabase.from("meal_entries").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}