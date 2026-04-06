export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('trimtrack_session_id')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('trimtrack_session_id', id) }
  return id
}

export async function saveProfile(profile: Record<string, unknown>) {
  const session_id = getSessionId()
  const res = await fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id, ...profile }) })
  return res.json()
}

export async function saveMeal(meal: { meal_type: string; food_name: string; kcal: number; protein: number; carbs: number; fat: number }) {
  const session_id = getSessionId()
  const res = await fetch('/api/meals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id, ...meal }) })
  return res.json()
}

export async function fetchMeals(date?: string) {
  const session_id = getSessionId()
  const dateStr = date || new Date().toISOString().split('T')[0]
  const res = await fetch('/api/meals?session_id=' + session_id + '&date=' + dateStr)
  return res.json()
}

export async function deleteMeal(id: string) {
  const res = await fetch('/api/meals?id=' + id, { method: 'DELETE' })
  return res.json()
}

export async function saveWeight(weight: number) {
  const session_id = getSessionId()
  const res = await fetch('/api/weights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id, weight }) })
  return res.json()
}

export async function fetchWeights() {
  const session_id = getSessionId()
  const res = await fetch('/api/weights?session_id=' + session_id)
  return res.json()
}