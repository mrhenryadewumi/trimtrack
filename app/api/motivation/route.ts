import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const eaten = Number(req.nextUrl.searchParams.get("eaten") || 0);
  const goal = Number(req.nextUrl.searchParams.get("goal") || 1500);
  if (!Number.isFinite(eaten) || !Number.isFinite(goal) || goal <= 0) {
    return NextResponse.json({ message: "" });
  }
  const pct = eaten / goal;
  let message = "";
  if (pct < 0.35) message = "Plenty of room left. A proper lunch still fits.";
  else if (pct < 0.7) message = "On track. Save the remaining calories for a meal you will actually enjoy.";
  else if (pct < 1) message = "Close to the line. A light dinner keeps the ring green.";
  else if (pct < 1.15) message = "A little over. One walk and a lighter breakfast tomorrow is enough.";
  else message = "A heavy day. Log it honestly and start again in the morning — the diary is the point.";
  return NextResponse.json({ message });
}
