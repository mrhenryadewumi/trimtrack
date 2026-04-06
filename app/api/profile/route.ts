import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return NextResponse.json({ error: 'session_id required' }, { status: 400 })
    const supabase = createServerClient()
    const { data, error } = await supabase.from('profiles').select('*').eq('session_id', sessionId).single()
    if (error && error.code !== 'PGRST116') throw error
    return NextResponse.json({ data: data || null })
  } catch (err) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, ...profile } = body
    if (!session_id) return NextResponse.json({ error: 'session_id required' }, { status: 400 })
    const supabase = createServerClient()
    const { data, error } = await supabase.from('profiles').upsert([{ session_id, ...profile, updated_at: new Date().toISOString() }], { onConflict: 'session_id' }).select().single()
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
