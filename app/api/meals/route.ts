import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ ok: true })

  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('session_id', sessionId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ meals: data })

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
