'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { calcDailyGoal, calcWeeksToGoal } from '@/lib/calculations'
import type { UserProfile, Gender, Activity, DrinkHabit } from '@/types'

const COUNTRIES = ['Nigeria', 'UK', 'USA', 'Canada', 'Ghana', 'South Africa', 'Australia', 'Germany', 'Other']
const GENDERS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
]
const ACTIVITIES: { value: Activity; label: string; desc: string }[] = [
  { value: 'sedentary', label: 'Mostly sitting', desc: 'Desk job, little movement' },
  { value: 'light', label: 'Light walking', desc: 'Some daily walking' },
  { value: 'moderate', label: 'Gym 2â“3Ã— week', desc: 'Regular exercise' },
  { value: 'active', label: 'Very active', desc: 'Daily intense training' },
]
const DRINK_OPTIONS: { value: DrinkHabit; label: string }[] = [
  { value: 'no', label: 'No' },
  { value: 'occasional', label: 'Occasionally' },
  { value: 'regular', label: 'Regularly' },
]
const AVOID_OPTIONS = ['No beef', 'No pork', 'No fish', 'No chicken', 'No restrictions']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 28,
    gender: 'female',
    country: '',
    startWeight: 85,
    goalWeight: 70,
    height: 168,
    activity: 'light',
    drink: 'no',
    avoidFoods: [],
    reminders: true,
  })

  function update<K extends keyof UserProfile>(key: K, val: UserProfile[K]) {
    setProfile(p => ({ ...p, [key]: val }))
  }

  function toggleAvoid(item: string) {
    if (item === 'No restrictions') { update('avoidFoods', []); return }
    const cur = profile.avoidFoods ?? []
    update('avoidFoods', cur.includes(item) ? cur.filter(x => x !== item) : [...cur, item])
  }

  function getCalGoal(): number {
    if (!profile.startWeight || !profile.goalWeight || !profile.height || !profile.age) return 1500
    return calcDailyGoal(profile as UserProfile)
  }

  function getWeeks(): number {
    if (!profile.startWeight || !profile.goalWeight) return 0
    return calcWeeksToGoal(profile as UserProfile)
  }

  async function handleFinish() {
    setSaving(true)
    const finalProfile: UserProfile = {
      ...(profile as UserProfile),
      dailyCalorieGoal: getCalGoal(),
    }
    localStorage.setItem('trimtrack_profile', JSON.stringify(finalProfile))
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: localStorage.getItem('trimtrack_session_id') || crypto.randomUUID(), ...finalProfile }),
      })
    } catch (e) { console.error(e) }
    setSaving(false)
    router.push('/trial')
  }

  const steps = ['About you', 'Your weight', 'Lifestyle', 'Review', 'Ready']
  const totalSteps = steps.length

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14L7 9L10 12L14 6" stroke="#b5f23d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="14" cy="6" r="2" fill="#b5f23d"/>
            </svg>
          </div>
          <span className="text-green-700 font-extrabold text-xl tracking-tight">TrimTrack</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? '#1a5c38' : '#d1fae5' }} />
          ))}
        </div>
        <div className="text-xs text-green-600 font-semibold mb-6 text-center uppercase tracking-wide">
          Step {step + 1} of {totalSteps} â” {steps[step]}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0 */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="card">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Let's set up your plan</h2>
                <p className="text-sm text-gray-500 mb-6">Tell us about yourself so we can personalise everything.</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Your name</label>
                    <input className="input-base" placeholder="e.g. Sarah" value={profile.name}
                      onChange={e => update('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Age</label>
                    <input className="input-base" type="number" placeholder="e.g. 28" value={profile.age}
                      onChange={e => update('age', parseInt(e.target.value) || 28)} min={16} max={80} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Gender</label>
                  <div className="flex flex-wrap gap-2">
                    {GENDERS.map(g => (
                      <button key={g.value} onClick={() => update('gender', g.value)}
                        className={`pill ${profile.gender === g.value ? 'pill-active' : ''}`}>{g.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Country you live in</label>
                  <div className="flex flex-wrap gap-2">
                    {COUNTRIES.map(c => (
                      <button key={c} onClick={() => update('country', c)}
                        className={`pill ${profile.country === c ? 'pill-active' : ''}`}>{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="card">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Your weight goals</h2>
                <p className="text-sm text-gray-500 mb-6">We use this to calculate your daily calorie target.</p>

                {[
                  { label: 'Current weight', key: 'startWeight' as const, min: 40, max: 180, unit: 'kg' },
                  { label: 'Goal weight', key: 'goalWeight' as const, min: 40, max: 180, unit: 'kg' },
                  { label: 'Height', key: 'height' as const, min: 140, max: 210, unit: 'cm' },
                ].map(field => (
                  <div key={field.key} className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{field.label}</label>
                      <span className="text-sm font-bold text-green-700">{profile[field.key]} {field.unit}</span>
                    </div>
                    <input type="range" min={field.min} max={field.max} step={1}
                      value={profile[field.key] as number}
                      onChange={e => update(field.key, parseInt(e.target.value))}
                      className="w-full accent-green-600" />
                  </div>
                ))}

                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800">
                  <div className="font-semibold mb-1">Your summary</div>
                  To lose <strong>{Math.max(0, (profile.startWeight ?? 0) - (profile.goalWeight ?? 0))} kg</strong>, 
                  you need roughly <strong>{getWeeks()} weeks</strong> at a healthy pace.<br/>
                  Estimated daily target: <strong>{getCalGoal().toLocaleString()} kcal</strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="card">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Your lifestyle</h2>
                <p className="text-sm text-gray-500 mb-6">This affects how many calories you burn each day.</p>

                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Activity level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ACTIVITIES.map(a => (
                      <button key={a.value} onClick={() => update('activity', a.value)}
                        className={`text-left px-4 py-3 rounded-2xl border transition-all ${
                          profile.activity === a.value
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}>
                        <div className="font-semibold text-sm">{a.label}</div>
                        <div className={`text-xs mt-0.5 ${profile.activity === a.value ? 'text-green-100' : 'text-gray-400'}`}>{a.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Do you drink alcohol?</label>
                  <div className="flex gap-2">
                    {DRINK_OPTIONS.map(d => (
                      <button key={d.value} onClick={() => update('drink', d.value)}
                        className={`pill ${profile.drink === d.value ? 'pill-active' : ''}`}>{d.label}</button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Any foods you don't eat?</label>
                  <div className="flex flex-wrap gap-2">
                    {AVOID_OPTIONS.map(a => (
                      <button key={a} onClick={() => toggleAvoid(a)}
                        className={`pill ${(profile.avoidFoods ?? []).includes(a) || (a === 'No restrictions' && (profile.avoidFoods ?? []).length === 0) ? 'pill-active' : ''}`}>{a}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Daily reminders?</label>
                  <div className="flex gap-2">
                    <button onClick={() => update('reminders', true)}
                      className={`pill ${profile.reminders ? 'pill-active' : ''}`}>Yes â” morning + evening</button>
                    <button onClick={() => update('reminders', false)}
                      className={`pill ${!profile.reminders ? 'pill-active' : ''}`}>No thanks</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 â” REVIEW */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="card">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Your personalised plan is ready âœ“</h2>
                <p className="text-sm text-gray-500 mb-6">Here's what TrimTrack calculated for you.</p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Daily calorie goal', val: `${getCalGoal().toLocaleString()} kcal`, highlight: true },
                    { label: 'Weeks to goal', val: `${getWeeks()} weeks` },
                    { label: 'To lose', val: `${Math.max(0, (profile.startWeight ?? 0) - (profile.goalWeight ?? 0))} kg` },
                    { label: 'Country meals', val: profile.country || 'Global' },
                  ].map(s => (
                    <div key={s.label} className={`rounded-2xl p-4 ${s.highlight ? 'bg-green-600 text-white' : 'bg-green-50'}`}>
                      <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${s.highlight ? 'text-green-100' : 'text-gray-500'}`}>{s.label}</div>
                      <div className={`text-xl font-extrabold ${s.highlight ? 'text-white' : 'text-gray-900'}`}>{s.val}</div>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                  <div>Name: <strong>{profile.name || 'Not set'}</strong></div>
                  <div>Activity: <strong>{profile.activity}</strong></div>
                  <div>Drinks alcohol: <strong>{profile.drink === 'no' ? 'No' : 'Yes'}</strong></div>
                  <div>Reminders: <strong>{profile.reminders ? 'Morning + evening' : 'Off'}</strong></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="card text-center">
                {/* Celebration icon */}
                <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
                  style={{ animation: 'bounce 1s ease infinite' }}>
                  ðŸŽ¯
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                  Your plan is ready, {profile.name || 'friend'}!
                </h2>
                <p className="text-sm text-gray-400 mb-8">Here's what TrimTrack calculated for you</p>

                {/* Big calorie number */}
                <div className="bg-green-700 rounded-3xl p-6 mb-4 text-center">
                  <div className="text-green-200 text-sm font-medium mb-1">Your daily calorie goal</div>
                  <div className="text-6xl font-extrabold text-white tracking-tight">
                    {getCalGoal().toLocaleString()}
                  </div>
                  <div className="text-green-200 text-sm mt-1">kcal per day</div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-green-50 rounded-2xl p-4 text-left">
                    <div className="text-xs text-gray-400 font-medium mb-1">To lose</div>
                    <div className="text-2xl font-extrabold text-gray-900">
                      {Math.max(0, (profile.startWeight ?? 0) - (profile.goalWeight ?? 0))} kg
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 text-left">
                    <div className="text-xs text-gray-400 font-medium mb-1">Estimated time</div>
                    <div className="text-2xl font-extrabold text-gray-900">
                      {getWeeks()} weeks
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 text-left">
                    <div className="text-xs text-gray-400 font-medium mb-1">Meal culture</div>
                    <div className="text-lg font-extrabold text-gray-900">
                      {profile.country || 'Global'} ðŸ½ï¸
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 text-left">
                    <div className="text-xs text-gray-400 font-medium mb-1">Reminders</div>
                    <div className="text-lg font-extrabold text-gray-900">
                      {profile.reminders ? 'âœ“ Morning + evening' : 'Off'}
                    </div>
                  </div>
                </div>

                {/* Goal date */}
                <div className="bg-lime-50 border border-lime-200 rounded-2xl px-4 py-3 mb-2">
                  <div className="text-sm font-semibold text-green-800">
                    At this pace you could reach {profile.goalWeight} kg by{' '}
                    <strong>
                      {new Date(Date.now() + getWeeks() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  Snap your first meal to get started. TrimTrack understands your food.
                </p>
              </div>

              <style>{`
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
              `}</style>
            </motion.div>
          )}

        <div className="flex justify-between items-center mt-6">
          {step > 0 && step < 4 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn-secondary">â†<- Back</button>
          ) : <div />}

          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn-primary">Continue ->â†’</button>
          ) : step === 3 ? (
            <button onClick={() => setStep(4)} className="btn-primary">See my plan â†’</button>
          ) : (
            <button onClick={handleFinish} disabled={saving} className="btn-primary w-full py-4 text-base">
              {saving ? 'Setting up...' : 'ðŸš Start tracking now'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
