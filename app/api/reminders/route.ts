import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ ok: true })

  try {
    const body = await req.json()

    const { data, error } = await supabase
      .from('reminders')
      .insert(body)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
