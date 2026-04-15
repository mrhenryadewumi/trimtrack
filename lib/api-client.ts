// Client-side API helpers — called from dashboard and onboarding

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('trimtrack_session_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('trimtrack_session_id', id)
  }
  return id
}

// ── PROFILE ──────────────────────────────────────────────────
export async function saveProfile(profile: Record<string, unknown>) {
  const session_id = getSessionId()
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, ...profile }),
  })
  return res.json()
}

export async function fetchProfile() {
  const session_id = getSessionId()
  const res = await fetch(`/api/profile?session_id=${session_id}`)
  return res.json()
}

// ── MEALS ─────────────────────────────────────────────────────
export async function saveMeal(meal: {
  meal_type: string
  food_name: string
  kcal: number
  protein: number
  carbs: number
  fat: number
}) {
  const session_id = getSessionId()
  const res = await fetch('/api/meals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, ...meal }),
  })
  return res.json()
}

export async function fetchMeals(date?: string) {
  const session_id = getSessionId()
  const now = new Date()
  const localDate = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0')
  const dateStr = date || localDate
  const res = await fetch(`/api/meals?session_id=${session_id}&date=${dateStr}`)
  return res.json()
}

export async function deleteMeal(id: string) {
  const res = await fetch('/api/meals', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
  return res.json()
}

// ── WEIGHTS ───────────────────────────────────────────────────
export async function saveWeight(weight: number) {
  const session_id = getSessionId()
  const res = await fetch('/api/weights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, weight }),
  })
  return res.json()
}

export async function fetchWeights() {
  const session_id = getSessionId()
  const res = await fetch(`/api/weights?session_id=${session_id}`)
  return res.json()
}

// ── REMINDERS ─────────────────────────────────────────────────
export async function sendReminder(params: {
  type: 'morning' | 'evening'
  email: string
  name: string
  daily_goal: number
  breakfast?: string
  avoid?: string[]
  eaten?: number
}) {
  const res = await fetch('/api/reminders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return res.json()
}
