import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const supabase = createServerClient()

  if (!supabase) {
    return NextResponse.json({ error: "No supabase" }, { status: 500 })
  }

  try {
    const body = await req.json()

    const {
      sessionId,
      name,
      age,
      weight,
      height,
      goal,
      country,
      activity
    } = body

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 400 })
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(sessionId)

    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const userId = userData.user.id

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name,
        age,
        weight,
        height,
        goal,
        country,
        activity
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}
