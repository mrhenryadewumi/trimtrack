import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return NextResponse.json({ error: 'session_id required' }, { status: 400 })
    const supabase = createServerClient()
    const { data, error } = await supabase.from('weight_log').select('*').eq('session_id', sessionId).order('date', { ascending: false }).limit(30)
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, weight } = body
    if (!session_id || !weight) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (weight < 30 || weight > 300) return NextResponse.json({ error: 'Invalid weight' }, { status: 400 })
    const supabase = createServerClient()
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase.from('weight_log').upsert([{ session_id, date: today, weight }], { onConflict: 'session_id,date' }).select().single()
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
