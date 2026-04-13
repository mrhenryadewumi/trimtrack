import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ ok: true })

  try {
    const { email } = await req.json()

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}