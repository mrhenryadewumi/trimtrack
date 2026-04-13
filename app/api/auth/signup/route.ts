import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const supabase = createServerClient()

  if (!supabase) {
    return NextResponse.json({ error: "No supabase" }, { status: 500 })
  }

  try {
    const { email, password } = await req.json()

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      sessionId: data.session?.access_token || null
    })

  } catch (err) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
