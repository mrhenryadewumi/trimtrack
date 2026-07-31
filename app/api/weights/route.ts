export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role, like every other route here. This used to build an anon
// client, so writes to weight_log went through row-level security and were
// silently rejected — no weight had ever been recorded.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = req.cookies.get('trimtrack_session')?.value || searchParams.get('session_id')
    if (!sessionId) return NextResponse.json({ error: 'session_id required' }, { status: 400 })

    const { data, error } = await supabase
      .from('weight_log')
      .select('*')
      .eq('session_id', sessionId)
      .order('date', { ascending: false })
      .limit(30)

    if (error) {
      console.error('Weights GET error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data })
  } catch (err: any) {
    console.error('Weights GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const sessionId = req.cookies.get('trimtrack_session')?.value || body.session_id
    const { weight } = body

    if (!sessionId || !weight) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (weight < 30 || weight > 300) return NextResponse.json({ error: 'Invalid weight' }, { status: 400 })

    // One row per day: the upsert replaces today's entry rather than adding.
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('weight_log')
      .upsert([{ session_id: sessionId, date: today, weight }], { onConflict: 'session_id,date' })
      .select()
      .single()

    if (error) {
      // The blanket 500 this used to return is what made the RLS rejection so
      // hard to place; pass the real reason back.
      console.error('Weights POST error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data })
  } catch (err: any) {
    console.error('Weights POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
