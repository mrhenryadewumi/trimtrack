export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    if (!sessionId) return NextResponse.json({ error: 'session_id required' }, { status: 400 })
    const supabase = createServerClient()
    const { data, error } = await supabase.from('meal_entries').select('*').eq('session_id', sessionId).eq('date', date).order('created_at', { ascending: true })
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, meal_type, food_name, kcal, protein, carbs, fat } = body
    if (!session_id || !meal_type || !food_name || !kcal) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const supabase = createServerClient()
    const { data, error } = await supabase.from('meal_entries').insert([{ session_id, date: new Date().toISOString().split('T')[0], meal_type, food_name, kcal, protein: protein || 0, carbs: carbs || 0, fat: fat || 0 }]).select().single()
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const supabase = createServerClient()
    const { error } = await supabase.from('meal_entries').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
