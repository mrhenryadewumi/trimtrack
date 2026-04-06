import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, email, name, daily_goal, breakfast, avoid, eaten } = body
    if (!email || !type) return NextResponse.json({ error: "email and type required" }, { status: 400 })
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (!RESEND_API_KEY) return NextResponse.json({ error: "Resend not configured" }, { status: 503 })
    const remaining = (daily_goal || 1500) - (eaten || 0)
    const over = remaining < 0
    const subject = type === "morning" ? "Good morning " + name + "! Your TrimTrack plan for today" : "Evening check-in | TrimTrack"
    const avoidList = avoid ? avoid.join(", ") : ""
    const html = type === "morning"
      ? "<div style='font-family:sans-serif;padding:24px'><h2>Good morning, " + name + "!</h2><p>Goal: <strong>" + daily_goal + " kcal</strong></p><p>Start with: <strong>" + breakfast + "</strong></p><p>Avoid: " + avoidList + "</p></div>"
      : "<div style='font-family:sans-serif;padding:24px'><h2>Evening check-in, " + name + "</h2><p>" + (over ? "You went " + Math.abs(remaining) + " kcal over today." : "You ate " + eaten + " kcal. Well done!") + "</p></div>"
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "TrimTrack <reminders@trimtrack.co>", to: [email], subject, html }),
    })
    if (!res.ok) throw new Error("Resend error")
    const result = await res.json()
    return NextResponse.json({ success: true, id: result.id })
  } catch (err) { return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 }) }
}