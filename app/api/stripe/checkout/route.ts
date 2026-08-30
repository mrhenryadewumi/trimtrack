import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    { error: "TrimTrack is free while we test. Payments are switched off." },
    { status: 503 }
  );
}
