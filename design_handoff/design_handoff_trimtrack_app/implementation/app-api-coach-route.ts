// app/api/coach/route.ts — Trim, the AI coach
// Env: ANTHROPIC_API_KEY. Uses your existing createServerClient() from lib/supabase.ts.
// npm i @anthropic-ai/sdk   (or keep the raw fetch below — zero new deps)

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: Request) {
  const supabase = createServerClient();
  if (!supabase) return NextResponse.json({ error: 'no supabase' }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { message, history = [] } = await req.json(); // history: [{role:'user'|'assistant', content}]
  if (!message?.trim()) return NextResponse.json({ error: 'empty' }, { status: 400 });

  // ---- Build today's snapshot from your existing tables (adjust names to your schema) ----
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: profile }, { data: meals }, { data: steps }] = await Promise.all([
    supabase.from('profiles').select('name, calorie_goal, weight_kg, goal_weight_kg, start_weight_kg, streak, protein_goal_g').eq('id', user.id).single(),
    supabase.from('meals').select('name, kcal, protein_g, meal_type').eq('user_id', user.id).gte('eaten_at', today),
    supabase.from('daily_steps').select('steps, kcal_earned').eq('user_id', user.id).eq('date', today).single(),
  ]);

  const eaten = (meals ?? []).reduce((a, m) => a + (m.kcal ?? 0), 0);
  const protein = (meals ?? []).reduce((a, m) => a + (m.protein_g ?? 0), 0);
  const goal = profile?.calorie_goal ?? 1500;
  const mealList = (meals ?? []).map(m => `${m.meal_type}: ${m.name} ${m.kcal} kcal`).join('; ') || 'nothing logged yet';

  const system =
    `You are Trim, the warm, practical AI nutrition coach inside TrimTrack, a calorie tracker built around African (especially Nigerian) food culture. ` +
    `Live user context: name ${profile?.name ?? 'friend'}; daily budget ${goal} kcal; eaten ${eaten} kcal today (${mealList}); ` +
    `${goal - eaten} kcal remaining; protein ${protein}g of ${profile?.protein_goal_g ?? 90}g; ` +
    `steps ${steps?.steps ?? 0} (earned +${steps?.kcal_earned ?? 0} kcal back); ` +
    `weight ${profile?.weight_kg} kg (started ${profile?.start_weight_kg}, goal ${profile?.goal_weight_kg}); streak ${profile?.streak ?? 0} days. ` +
    `Answer in 1-3 short sentences, concrete and encouraging, referencing familiar Nigerian foods where natural. ` +
    `Plain text only — no markdown, no lists. Never invent data not in this context. You are not a doctor; for medical questions, say so briefly.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',          // fast + cheap; upgrade to a sonnet model if replies feel thin
      max_tokens: 300,
      system,
      messages: [...history.slice(-8), { role: 'user', content: message }],
    }),
  });

  if (!res.ok) return NextResponse.json({ error: 'coach unavailable' }, { status: 502 });
  const data = await res.json();
  return NextResponse.json({ reply: data.content?.[0]?.text ?? '' });
}

// Client usage (coach screen):
//   const r = await fetch('/api/coach', { method:'POST', body: JSON.stringify({ message, history }) });
//   const { reply } = await r.json();
// Gate by plan: check profile.is_pro and return 402 with an upsell message for free users past N questions/day.
