export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role, like the rest of the API. The anon client this used to build
// went through row-level security, so inserts could be rejected — and the
// handler answered success regardless, which hid it.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { error } = await supabase
      .from('waitlist')
      .insert([{ email: email.trim(), created_at: new Date().toISOString() }])

    // 23505 is a duplicate address — already on the list, so still a success.
    if (error && error.code !== '23505') {
      console.error('Waitlist insert error:', error)
      return NextResponse.json({ error: 'Could not add you just now' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
