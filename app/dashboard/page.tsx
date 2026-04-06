'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getCalorieStatus, getStatusColour, getStatusMessage, getDailyPlan, getExercises, getGreeting, formatKcal } from '@/lib/calculations'
import { FOODS } from '@/lib/foods'
import type { UserProfile, MealEntry, WeightEntry } from '@/types'

type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner'

const MEAL_DEFS: { key: MealType; label: string; color: string }[] = [
  { key: 'breakfast', label: 'Breakfast', color: '#166534' },
  { key: 'lunch',     label: 'Lunch',     color: '#1d4ed8' },
  { key: 'snack',     label: 'Snack',     color: '#b45309' },
  { key: 'dinner',    label: 'Dinner',    color: '#6d28d9' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [meals, setMeals] = useState<Record<MealType, MealEntry[]>>({ breakfast: [], lunch: [], snack: [], dinner: [] })
  const [weightLog, setWeightLog] = useState<WeightEntry[]>([])
  const [wtInput, setWtInput] = useState('')
  const [exDone, setExDone] = useState<Record<number, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast')
  const [activeTab, setActiveTab] = useState<'meals' | 'progress' | 'reminders'>('meals')

  useEffect(() => {
    const saved = localStorage.getItem('trimtrack_profile')
    if (!saved) { router.push('/onboarding'); return }
    setProfile(JSON.parse(saved))

    const savedMeals = localStorage.getItem('trimtrack_meals_today')
    if (savedMeals) setMeals(JSON.parse(savedMeals))

    const savedWt = localStorage.getItem('trimtrack_weights')
    if (savedWt) setWeightLog(JSON.parse(savedWt))
  }, [router])

  const saveMeals = useCallback((m: Record<MealType, MealEntry[]>) => {
    localStorage.setItem('trimtrack_meals_today', JSON.stringify(m))
  }, [])

  const eaten = Object.values(meals).flat().reduce((s, m) => s + m.kcal, 0)
  const goal = profile?.dailyCalorieGoal ?? 1500
  const remain = goal - eaten
  const pct = Math.min(100, Math.round((eaten / goal) * 100))
  const status = getCalorieStatus(eaten, goal)
  const barColour = getStatusColour(status)

  function addFood(foodIdx: number) {
    const food = FOODS[foodIdx]
    const entry: MealEntry = {
      userId: 'local',
      date: new Date().toISOString().split('T')[0],
      mealType: activeMeal,
      foodName: food.name,
      kcal: food.kcal,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    }
    const updated = { ...meals, [activeMeal]: [...meals[activeMeal], entry] }
    setMeals(updated)
    saveMeals(updated)
  }

  function removeFood(mealType: MealType, idx: number) {
    const updated = { ...meals, [mealType]: meals[mealType].filter((_, i) => i !== idx) }
    setMeals(updated)
    saveMeals(updated)
  }

  function logWeight() {
    const val = parseFloat(wtInput)
    if (isNaN(val) || val < 30 || val > 300) return
    const entry: WeightEntry = {
      userId: 'local',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      weight: val,
    }
    const updated = [entry, ...weightLog]
    setWeightLog(updated)
    localStorage.setItem('trimtrack_weights', JSON.stringify(updated))
    setWtInput('')
  }

  const filteredFoods = FOODS.filter(f =>
    (!searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!catFilter || f.category === catFilter)
  )

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-green-600 font-semibold">Loading your plan...</div>
    </div>
  )

  const plan = getDailyPlan(profile.country)
  const exercises = getExercises(profile.activity)
  const totalBurned = exercises.reduce((s, ex, i) => s + (exDone[i] ? ex.burn : 0), 0)
  const effectiveEaten = Math.max(0, eaten - totalBurned)

  return (
    <div className="min-h-screen">
      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L7 9L10 12L14 6" stroke="#b5f23d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="14" cy="6" r="2" fill="#b5f23d"/>
              </svg>
            </div>
            <span className="font-extrabold text-green-700">TrimTrack</span>
          </div>
          <button onClick={() => router.push('/onboarding')} className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50">
            Edit profile
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* GREETING */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">{getGreeting(profile.name)}</h1>
          <p className="text-sm text-gray-500 mt-1">Goal: {formatKcal(goal)} today · Target: {profile.goalWeight} kg</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Daily goal', val: goal.toLocaleString(), unit: 'kcal' },
            { label: 'Eaten today', val: eaten.toLocaleString(), unit: 'kcal' },
            { label: 'Remaining', val: Math.abs(remain).toLocaleString(), unit: remain < 0 ? 'kcal over' : 'kcal left', colour: remain < 0 ? 'text-red-600' : remain < 200 ? 'text-yellow-600' : 'text-green-600' },
            { label: 'Burned (exercise)', val: totalBurned.toString(), unit: 'kcal', colour: 'text-blue-600' },
          ].map(s => (
            <div key={s.label} className="bg-green-50 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className={`text-xl font-extrabold ${s.colour || 'text-gray-900'}`}>{s.val}</div>
              <div className="text-xs text-gray-400">{s.unit}</div>
            </div>
          ))}
        </div>

        {/* CALORIE BAR */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-800">Today's progress</span>
            <span className="text-sm text-gray-500">{pct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
            <motion.div className="h-full rounded-full" style={{ background: barColour }}
              animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{eaten.toLocaleString()} eaten</span>
            <span>Goal: {goal.toLocaleString()}</span>
          </div>
        </div>

        {/* ALERT */}
        <div className={`rounded-2xl px-4 py-3 text-sm font-medium mb-6 ${
          status === 'good' || status === 'empty' ? 'bg-green-50 text-green-700 border border-green-200' :
          status === 'warn' || status === 'critical' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {getStatusMessage(status, eaten, goal)}
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6">
          {(['meals', 'progress', 'reminders'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === t ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* MEALS TAB */}
        {activeTab === 'meals' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* FOOD SEARCH */}
            <div className="card">
              <div className="font-semibold text-gray-800 mb-3">Food search</div>
              <div className="flex gap-2 mb-4">
                <input className="input-base flex-1" placeholder="Search foods..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)} />
                <select className="input-base w-auto" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="protein">Protein</option>
                  <option value="carbs">Carbs</option>
                  <option value="veg">Veg / Soups</option>
                  <option value="snack">Snacks</option>
                  <option value="drink">Drinks</option>
                </select>
              </div>
              <div className="flex gap-2 mb-3 text-xs text-gray-500">
                Adding to:
                {MEAL_DEFS.map(m => (
                  <button key={m.key} onClick={() => setActiveMeal(m.key)}
                    className={`px-3 py-1 rounded-full font-semibold transition-all ${
                      activeMeal === m.key ? 'text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                    style={activeMeal === m.key ? { background: m.color } : {}}>
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredFoods.slice(0, 30).map((f, i) => (
                  <div key={f.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-green-50 transition-colors">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{f.name}</div>
                      <div className="text-xs text-gray-400">{f.protein}g protein · {f.carbs}g carbs · {f.fat}g fat</div>
                    </div>
                    <div className="text-sm text-gray-500 mr-2">{f.kcal} kcal</div>
                    <button onClick={() => addFood(FOODS.indexOf(f))}
                      className="text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-500 transition-colors">
                      + Add
                    </button>
                  </div>
                ))}
                {filteredFoods.length === 0 && <div className="text-center text-sm text-gray-400 py-6">No foods found</div>}
              </div>
            </div>

            {/* MEAL PLAN */}
            <div className="card">
              <div className="font-semibold text-gray-800 mb-3">My meals today</div>
              <div className="space-y-3">
                {MEAL_DEFS.map(m => {
                  const items = meals[m.key]
                  const mkcal = items.reduce((s, i) => s + i.kcal, 0)
                  const suggestion = plan[m.key][new Date().getDate() % plan[m.key].length]
                  return (
                    <div key={m.key} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 cursor-pointer"
                        onClick={() => setActiveMeal(m.key)}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                          <span className="font-semibold text-sm text-gray-800">{m.label}</span>
                          {activeMeal === m.key && <span className="text-xs text-blue-500 font-medium">← adding here</span>}
                        </div>
                        <span className="text-xs text-gray-400">{mkcal} kcal</span>
                      </div>
                      <div className="px-4 py-2">
                        <div className="text-xs text-gray-400 mb-2">Suggested: {suggestion}</div>
                        {items.map((it, ii) => (
                          <div key={ii} className="flex items-center gap-2 py-1">
                            <span className="flex-1 text-sm text-gray-700">{it.foodName}</span>
                            <span className="text-xs text-gray-400">{it.kcal} kcal</span>
                            <button onClick={() => removeFood(m.key, ii)} className="text-gray-300 hover:text-red-400 text-base leading-none px-1">×</button>
                          </div>
                        ))}
                        {items.length === 0 && <div className="text-xs text-gray-300 italic py-1">Nothing added yet</div>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* MACROS */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                {[
                  { label: 'Protein', val: Object.values(meals).flat().reduce((s, i) => s + i.protein, 0) },
                  { label: 'Carbs',   val: Object.values(meals).flat().reduce((s, i) => s + i.carbs, 0) },
                  { label: 'Fat',     val: Object.values(meals).flat().reduce((s, i) => s + i.fat, 0) },
                ].map(m => (
                  <div key={m.label} className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-base font-extrabold text-gray-900">{m.val}g</div>
                    <div className="text-xs text-gray-500">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* WEIGHT LOG */}
            <div className="card">
              <div className="font-semibold text-gray-800 mb-3">Weight log</div>
              <div className="flex gap-2 mb-4">
                <input className="input-base flex-1" type="number" placeholder="Today's weight (kg)"
                  value={wtInput} onChange={e => setWtInput(e.target.value)} step="0.1" min="30" max="300" />
                <button onClick={logWeight} className="btn-primary py-2 px-5 text-sm">Log</button>
              </div>

              {weightLog.length > 0 && (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress to goal</span>
                      <span>{Math.max(0, weightLog[weightLog.length - 1].weight - weightLog[0].weight).toFixed(1)} kg lost</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, (weightLog[weightLog.length-1].weight - weightLog[0].weight) / (profile.startWeight - profile.goalWeight) * 100))}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {weightLog.slice(0, 7).map((e, i) => {
                      const diff = i < weightLog.length - 1 ? e.weight - weightLog[i + 1].weight : null
                      return (
                        <div key={i} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-xl text-sm">
                          <span className="text-gray-500">{e.date}</span>
                          <span className="font-bold text-gray-900">{e.weight} kg</span>
                          {diff === null ? <span className="text-gray-300 text-xs">start</span> :
                            diff > 0 ? <span className="text-red-500 text-xs font-semibold">+{diff.toFixed(1)}</span> :
                            <span className="text-green-600 text-xs font-semibold">{diff.toFixed(1)}</span>}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* EXERCISE */}
            <div className="card">
              <div className="font-semibold text-gray-800 mb-3">Today's exercise</div>
              <div className="space-y-3">
                {exercises.map((ex, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    exDone[i] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg flex-shrink-0">
                      {i === 0 ? '🏃' : '💪'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-800">{ex.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{ex.detail}</div>
                      <div className="text-xs text-green-600 font-semibold mt-0.5">Burns ~{ex.burn} kcal · {ex.duration}</div>
                    </div>
                    <button onClick={() => setExDone(d => ({ ...d, [i]: !d[i] }))}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                        exDone[i] ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 text-transparent hover:border-green-400'
                      }`}>
                      ✓
                    </button>
                  </div>
                ))}
              </div>
              {totalBurned > 0 && (
                <div className="mt-3 bg-green-50 rounded-xl px-4 py-2.5 text-sm font-semibold text-green-700">
                  Total burned today: ~{totalBurned} kcal
                </div>
              )}

              {/* FOODS TO AVOID */}
              <div className="mt-6">
                <div className="font-semibold text-gray-800 mb-3">Foods to avoid today</div>
                <div className="flex flex-wrap gap-2">
                  {plan.avoid.map(f => (
                    <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-medium">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REMINDERS TAB */}
        {activeTab === 'reminders' && (
          <div className="max-w-xl">
            {profile.reminders ? (
              <div className="space-y-4">
                <div className="card">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">7:00 AM — Morning plan</div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    Good morning {profile.name}! Today's calorie goal is <strong>{goal.toLocaleString()} kcal</strong>.<br/>
                    Start your day with: <strong>{plan.breakfast[new Date().getDate() % plan.breakfast.length]}</strong>.<br/>
                    Don't forget to drink 2.5L of water today.
                  </div>
                  <div className="inline-block mt-3 text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Morning</div>
                </div>
                <div className="card">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">8:00 PM — Evening check-in</div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    Evening check-in: You've eaten <strong>{eaten.toLocaleString()} kcal</strong> today.{' '}
                    {remain > 0 ? `${remain.toLocaleString()} kcal remaining — finish strong!` : `You're ${Math.abs(remain).toLocaleString()} kcal over today.`}<br/>
                    Tomorrow's breakfast: <strong>{plan.breakfast[(new Date().getDate() + 1) % plan.breakfast.length]}</strong>.
                  </div>
                  <div className="inline-block mt-3 text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Evening</div>
                </div>
                <div className="card">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Daily — Foods to avoid</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {plan.avoid.map(f => (
                      <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card text-center py-10">
                <div className="text-3xl mb-3">🔕</div>
                <div className="font-semibold text-gray-800 mb-2">Reminders are off</div>
                <div className="text-sm text-gray-500 mb-4">Enable them in your profile to get daily meal plans and check-ins.</div>
                <button onClick={() => router.push('/onboarding')} className="btn-primary text-sm">Update profile</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
