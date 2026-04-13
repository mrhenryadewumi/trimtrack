import { createServerClient } from '@/lib/supabase'

export async function POST(req: Request) {

  const supabase = createServerClient()
  if (!supabase) return new Response(JSON.stringify({ ok: true }))

  try {
    return new Response(JSON.stringify({ success: true }))
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
  }
}
