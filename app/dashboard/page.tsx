'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getCalorieStatus, getStatusColour, getStatusMessage, getDailyPlan, getExercises, getGreeting } from '@/lib/calculations'
import { FOODS } from '@/lib/foods'
import { saveMeal, deleteMeal, saveWeight, fetchWeights, fetchMeals } from '@/lib/api-client'
import PhotoScanner from '@/components/PhotoScanner'
import UpgradeModal from '@/components/UpgradeModal'
import ScanGate from '@/components/ScanGate'
import StepCounter from '@/components/StepCounter'
import FoodSearch from '@/components/FoodSearch'
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
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [scansLeft, setScansLeft] = useState(3)
  const [isPremium, setIsPremium] = useState(false)
  const [activeTab, setActiveTab] = useState<'log' | 'progress' | 'plan'>('log')

  const saveMealsLocal = useCallback((m: Record<MealType, MealEntry[]>) => {
    localStorage.setItem('trimtrack_meals_today', JSON.stringify(m))
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('trimtrack_profile')
    if (saved) {
      setProfile(JSON.parse(saved))
    }
    // Always sync from API to get latest name and plan
    fetch('/api/profile', { method: 'GET', credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data && data.name) {
          setProfile(data)
          localStorage.setItem('trimtrack_profile', JSON.stringify(data))
        } else if (!saved) {
          router.push('/onboarding')
        }
      })
      .catch(() => { if (!saved) router.push('/onboarding') })
    const savedMeals = localStorage.getItem('trimtrack_meals_today')
    if (savedMeals) setMeals(JSON.parse(savedMeals))
    const savedWt = localStorage.getItem('trimtrack_weights')
    if (savedWt) setWeightLog(JSON.parse(savedWt))
    fetchMeals().then(res => {
      if (res?.data?.length) {
        const grouped: Record<MealType, MealEntry[]> = { breakfast: [], lunch: [], snack: [], dinner: [] }
        res.data.forEach((m: { id: string; meal_type: MealType; food_name: string; kcal: number; protein: number; carbs: number; fat: number }) => {
          if (grouped[m.meal_type]) grouped[m.meal_type].push({ id: m.id, userId: 'local', date: new Date().toISOString().split('T')[0], mealType: m.meal_type, foodName: m.food_name, kcal: m.kcal, protein: m.protein, carbs: m.carbs, fat: m.fat })
        })
        setMeals(grouped); saveMealsLocal(grouped)
      }
    }).catch(() => {})
    fetchWeights().then(res => {
      if (res?.data?.length) {
        const wts = res.data.map((w: { date: string; weight: number }) => ({ userId: 'local', date: w.date, weight: w.weight }))
        setWeightLog(wts); localStorage.setItem('trimtrack_weights', JSON.stringify(wts))
      }
    }).catch(() => {})
  }, [router, saveMealsLocal])

  const allMeals = Object.values(meals).flat()
  const eaten = allMeals.reduce((s, m) => s + m.kcal, 0)
  const goal = profile?.dailyCalorieGoal ?? 1500
  const remain = goal - eaten
  const pct = Math.min(100, Math.round((eaten / goal) * 100))
  const status = getCalorieStatus(eaten, goal)
  const exercises = profile ? getExercises(profile.activity) : []
  const totalBurned = exercises.reduce((s, ex, i) => s + (exDone[i] ? ex.burn : 0), 0)

  async function addFood(foodIdx: number) {
    const food = FOODS[foodIdx]
    const entry: MealEntry = { userId: 'local', date: new Date().toISOString().split('T')[0], mealType: activeMeal, foodName: food.name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat }
    const updated = { ...meals, [activeMeal]: [...meals[activeMeal], entry] }
    setMeals(updated); saveMealsLocal(updated)
    try {
      const result = await saveMeal({ meal_type: activeMeal, food_name: food.name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat })
      if (result?.data?.id) {
        const withId = { ...updated, [activeMeal]: updated[activeMeal].map((e, i) => i === updated[activeMeal].length - 1 ? { ...e, id: result.data.id } : e) }
        setMeals(withId); saveMealsLocal(withId)
      }
    } catch (e) { console.error(e) }
  }

  async function removeFood(mealType: MealType, idx: number) {
    const entry = meals[mealType][idx]
    const updated = { ...meals, [mealType]: meals[mealType].filter((_, i) => i !== idx) }
    setMeals(updated); saveMealsLocal(updated)
    if (entry?.id) { try { await deleteMeal(entry.id) } catch (e) { console.error(e) } }
  }

  async function handlePhotoAdd(food: { food_name: string; kcal: number; protein: number; carbs: number; fat: number }) {
    const entry: MealEntry = { userId: 'local', date: new Date().toISOString().split('T')[0], mealType: activeMeal, foodName: food.food_name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat }
    const updated = { ...meals, [activeMeal]: [...meals[activeMeal], entry] }
    setMeals(updated); saveMealsLocal(updated)
    try { await saveMeal({ meal_type: activeMeal, food_name: food.food_name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat }) } catch (e) { console.error(e) }
  }

  async function logWeight() {
    const val = parseFloat(wtInput)
    if (isNaN(val) || val < 30 || val > 300) return
    const entry: WeightEntry = { userId: 'local', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), weight: val }
    const updated = [entry, ...weightLog]
    setWeightLog(updated); localStorage.setItem('trimtrack_weights', JSON.stringify(updated)); setWtInput('')
    try { await saveWeight(val) } catch (e) { console.error(e) }
  }

  

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6fbf8]">
      <div className="text-green-600 font-semibold animate-pulse">Loading...</div>
    </div>
  )

  const plan = getDailyPlan(profile.country)
  const remainColour = remain < 0 ? 'text-red-300' : remain < 200 ? 'text-yellow-300' : 'text-white'
  const alertBg = status === 'good' || status === 'empty' ? 'bg-green-50 text-green-700 border-green-200' :
    status === 'warn' || status === 'critical' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
    'bg-red-50 text-red-700 border-red-200'

  return (
    <div className="min-h-screen bg-[#f6fbf8]">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#f6fbf8]/95 backdrop-blur border-b border-green-100 px-5 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L7 9L10 12L14 6" stroke="#b5f23d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="14" cy="6" r="2" fill="#b5f23d"/>
              </svg>
            </div>
            <a href="/" style={{ textDecoration: "none" }}><span className="font-extrabold text-green-800">TrimTrack</span></a>
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <a href="/login" style={{fontSize:"12px",color:"#1a5c38",fontWeight:"600",textDecoration:"none"}}>Login</a>
            <button onClick={() => router.push('/onboarding')} className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1.5">
              Edit profile
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-5">

        {/* GREETING */}
        <p className="text-lg font-extrabold text-gray-900 mb-4">{getGreeting(profile.name)}</p>

        {/* HERO */}
        <div className="bg-green-700 rounded-3xl p-5 mb-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -mr-8 -mt-8"/>
          <div className="text-green-200 text-xs font-medium mb-0.5">Remaining today</div>
          <div className={`text-5xl font-extrabold tracking-tight mb-0.5 ${remainColour}`}>
            {Math.abs(remain).toLocaleString()}
          </div>
          <div className="text-green-200 text-xs mb-3">
            {remain < 0 ? 'kcal over goal' : `kcal left - ${eaten.toLocaleString()} eaten of ${goal.toLocaleString()}`}
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: remain < 0 ? '#fca5a5' : remain < 200 ? '#fde047' : '#b5f23d' }}
              animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
          </div>
        </div>

        {/* ALERT */}
        <div className={`rounded-2xl px-4 py-2.5 text-sm font-medium mb-4 border ${alertBg}`}>
          {getStatusMessage(status, eaten, goal)}
        </div>

        {/* MEAL SELECTOR + SCAN */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
          <div className="flex gap-2 mb-3">
            {MEAL_DEFS.map(m => (
              <button key={m.key} onClick={() => setActiveMeal(m.key)}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                style={activeMeal === m.key ? { background: m.color, color: '#fff' } : { background: '#f3f4f6', color: '#6b7280' }}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <div>
              {showUpgrade && (
                <UpgradeModal
                  onClose={() => setShowUpgrade(false)}
                  sessionId={typeof window !== "undefined" ? localStorage.getItem("sessionId") || "" : ""}
                />
              )}
              {scansLeft > 0 || isPremium ? (
                <PhotoScanner onAdd={async (meal) => {
                  const sid = typeof window !== "undefined" ? localStorage.getItem("sessionId") || "" : "";
                  const res = await fetch("/api/subscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId: sid }),
                  });
                  const data = await res.json();
                  if (data.limitReached) { setShowUpgrade(true); return; }
                  setScansLeft(data.scansLeft);
                  handlePhotoAdd(meal);
                }} mealType={activeMeal} />
              ) : (
                <button
                  onClick={() => setShowUpgrade(true)}
                  style={{
                    width: "100%", padding: "14px", background: "#1a5c38",
                    color: "#b5f23d", border: "none", borderRadius: "14px",
                    fontSize: "16px", fontWeight: "700", cursor: "pointer"
                  }}
                >
                  Scan Food (0 scans left - Upgrade)
                </button>
              )}
              {!isPremium && (
                <div style={{ textAlign: "center", fontSize: "12px", color: "#888", marginTop: "6px" }}>
                  {scansLeft} free scan{scansLeft !== 1 ? "s" : ""} remaining today
                </div>
              )}
            </div>
            </div>
          </div>
          <div className="mt-3">
            <FoodSearch activeMeal={activeMeal} onAdd={handlePhotoAdd} />
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'log' as const, label: "Today's meals" },
            { key: 'progress' as const, label: 'Progress' },
            { key: 'plan' as const, label: 'My plan' },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === t.key ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* MEALS TAB */}
        {activeTab === 'log' && (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {MEAL_DEFS.map((m, mi) => {
              const items = meals[m.key]
              const mkcal = items.reduce((s, i) => s + i.kcal, 0)
              return (
                <div key={m.key} className={mi < 3 ? 'border-b border-gray-50' : ''}>
                  <div className="flex items-center justify-between px-4 py-3 cursor-pointer"
                    onClick={() => { setActiveMeal(m.key); setActiveTab('log') }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: m.color }}/>
                      <span className="font-bold text-sm text-gray-800">{m.label}</span>
                    </div>
                    <span className="text-xs text-gray-400">{mkcal > 0 ? `${mkcal} kcal` : 'tap to add'}</span>
                  </div>
                  {items.length > 0 && (
                    <div className="px-4 pb-3 space-y-1">
                      {items.map((it, ii) => (
                        <div key={ii} className="flex items-center gap-2">
                          <span className="flex-1 text-sm text-gray-600 truncate">{it.foodName}</span>
                          <span className="text-xs text-gray-400">{it.kcal} kcal</span>
                          <button onClick={() => removeFood(m.key, ii)} className="text-gray-300 hover:text-red-400 text-lg leading-none ml-1">Ãƒâ€”</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            {/* MACROS */}
            <div className="grid grid-cols-3 border-t border-gray-50">
              {[
                { label: 'Protein', val: allMeals.reduce((s, i) => s + i.protein, 0), color: 'text-blue-600' },
                { label: 'Carbs', val: allMeals.reduce((s, i) => s + i.carbs, 0), color: 'text-yellow-600' },
                { label: 'Fat', val: allMeals.reduce((s, i) => s + i.fat, 0), color: 'text-orange-600' },
              ].map((m, i) => (
                <div key={m.label} className={`py-3 text-center ${i < 2 ? 'border-r border-gray-50' : ''}`}>
                  <div className={`text-base font-extrabold ${m.color}`}>{m.val}g</div>
                  <div className="text-xs text-gray-400">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <StepCounter />
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <div className="font-extrabold text-gray-900 mb-3">Weight log</div>
              <div className="flex gap-2 mb-3">
                <input className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-green-600"
                  type="number" placeholder="Today's weight (kg)" value={wtInput}
                  onChange={e => setWtInput(e.target.value)} step="0.1" min="30" max="300" />
                <button onClick={logWeight} className="bg-green-700 text-white font-bold text-sm px-5 py-2.5 rounded-full">Log</button>
              </div>
              {weightLog.slice(0, 5).map((e, i) => {
                const diff = i < weightLog.length - 1 ? e.weight - weightLog[i + 1].weight : null
                return (
                  <div key={i} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-xl text-sm mb-1">
                    <span className="text-gray-500">{e.date}</span>
                    <span className="font-bold">{e.weight} kg</span>
                    {diff === null ? <span className="text-gray-300 text-xs">start</span> :
                      diff > 0 ? <span className="text-red-500 text-xs font-bold">+{diff.toFixed(1)}</span> :
                      <span className="text-green-600 text-xs font-bold">{diff.toFixed(1)}</span>}
                  </div>
                )
              })}
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <div className="font-extrabold text-gray-900 mb-3">Exercise</div>
              <div className="space-y-2">
                {exercises.map((ex, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer ${exDone[i] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}
                    onClick={() => setExDone(d => ({ ...d, [i]: !d[i] }))}>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-800">{ex.title}</div>
                      <div className="text-xs text-green-600 font-semibold">~{ex.burn} kcal Ã‚Â· {ex.duration}</div>
                    </div>
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs ${exDone[i] ? 'bg-green-700 border-green-700 text-white' : 'border-gray-300 text-transparent'}`}>Ã¢Å“â€œ</div>
                  </div>
                ))}
              </div>
              {totalBurned > 0 && <div className="mt-2 bg-green-50 rounded-xl px-4 py-2 text-sm font-bold text-green-700">~{totalBurned} kcal earned back</div>}
            </div>
          </div>
        )}

        {/* PLAN TAB */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <div className="font-extrabold text-gray-900 mb-4">Today's meal plan Ã‚Â· {profile.country || 'Global'}</div>
              <div className="space-y-3">
                {MEAL_DEFS.map(m => (
                  <div key={m.key} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: m.color }}/>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase">{m.label}</div>
                      <div className="text-sm text-gray-800">{plan[m.key][new Date().getDate() % plan[m.key].length]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <div className="font-extrabold text-gray-900 mb-3">Avoid today</div>
              <div className="flex flex-wrap gap-2">
                {plan.avoid.map(f => (
                  <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 font-medium">{f}</span>
                ))}
              </div>
            </div>
            {profile.reminders && (
              <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
                <div className="font-extrabold text-gray-900 mb-3">Reminders</div>
                <div className="space-y-2">
                  <div className="bg-yellow-50 rounded-2xl p-3 border border-yellow-100">
                    <div className="text-xs font-bold text-yellow-700 mb-1">7:00 AM</div>
                    <div className="text-sm text-gray-700">Goal: <strong>{goal.toLocaleString()} kcal</strong>. Start with <strong>{plan.breakfast[0]}</strong>.</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100">
                    <div className="text-xs font-bold text-blue-700 mb-1">8:00 PM</div>
                    <div className="text-sm text-gray-700">{eaten > 0 ? `${eaten.toLocaleString()} kcal eaten. ${remain > 0 ? `${remain.toLocaleString()} remaining.` : `${Math.abs(remain).toLocaleString()} over.`}` : "Don't forget to log your meals!"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
