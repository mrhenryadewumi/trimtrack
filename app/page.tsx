'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const features = [
  {
    icon: '📊',
    title: 'Real-time calorie tracking',
    desc: 'Log meals with a tap. Watch your daily ring fill — green means good, yellow means careful, red means stop.',
  },
  {
    icon: '🍽️',
    title: 'Meals built around your food',
    desc: 'Tell us your country and food culture. TrimTrack builds your plan around food you actually enjoy — not salads you will never eat.',
  },
  {
    icon: '🔔',
    title: 'Daily reminders that actually help',
    desc: 'Subscribers get a morning message with today\'s meal plan and an evening check-in. You don\'t have to remember — we do.',
  },
  {
    icon: '⚖️',
    title: 'Weight progress tracker',
    desc: 'Log your weight daily. Watch your progress chart trend downward week by week toward your goal.',
  },
  {
    icon: '🏃',
    title: 'Exercise recommendations',
    desc: 'Daily exercises matched to your fitness level — from gentle walks to HIIT — with calories burned counted toward your day.',
  },
  {
    icon: '🚫',
    title: 'Daily foods to avoid',
    desc: 'Every day you get a short list of what to skip and why. Know exactly what\'s working against your goal.',
  },
]

const testimonials = [
  {
    name: 'Adaeze O.',
    location: 'London, UK',
    text: 'I tried every diet app and they all recommended food I\'d never eat. TrimTrack gave me a plan built around Nigerian food. Lost 4kg in my first month without giving up jollof rice.',
    initials: 'AO',
  },
  {
    name: 'Kwame A.',
    location: 'Toronto, Canada',
    text: 'The morning reminder changed everything. I used to forget to track until the evening. Now my plan arrives at 7am and I just follow it. Simple.',
    initials: 'KA',
  },
  {
    name: 'Maryam B.',
    location: 'Manchester, UK',
    text: 'The red calorie alert is genius. I\'d always overeat at dinner without realising. Now I can see exactly how much room I have left. Down 6kg in 6 weeks.',
    initials: 'MB',
  },
]

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setLoading(true)
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true) // still show success UX
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f6fbf8]/90 backdrop-blur-md border-b border-green-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L7 9L10 12L14 6" stroke="#b5f23d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="14" cy="6" r="2" fill="#b5f23d"/>
              </svg>
            </div>
            <span className="text-green-700 font-extrabold text-lg tracking-tight">TrimTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-green-800 hover:text-green-600 transition-colors">Features</a>
            <a href="#how" className="text-sm font-medium text-green-800 hover:text-green-600 transition-colors">How it works</a>
            <Link href="/onboarding" className="btn-primary text-sm py-2 px-5">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-lime-400 text-green-800 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
              🌿 Your weight loss companion
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-gray-900 mb-5">
              Lose weight eating{' '}
              <span className="text-green-600 relative">
                food you love.
                <span className="absolute bottom-1 left-0 right-0 h-1 bg-lime-400 rounded-full -z-10" />
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              TrimTrack gives you personalised daily meal plans, real-time calorie tracking,
              and gentle reminders — so you never have to guess what to eat again.
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700 font-medium">
                ✓ You're on the list! We'll be in touch when we launch.
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-wrap gap-3 mb-5">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input-base flex-1 min-w-[220px]"
                  required
                />
                <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
                  {loading ? 'Joining...' : 'Get early access'}
                </button>
              </form>
            )}

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex">
                {['A','K','M','T'].map(l => (
                  <div key={l} className="w-7 h-7 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-green-700 font-bold text-xs -mr-1.5">
                    {l}
                  </div>
                ))}
              </div>
              <span><strong className="text-gray-800">847 people</strong> already on the waitlist</span>
            </div>

            <div className="mt-8">
              <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2">
                Build my free plan →
              </Link>
            </div>
          </motion.div>

          {/* HERO MOCKUP */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="card p-7 shadow-xl"
            style={{ animation: 'float 4s ease-in-out infinite' }}
          >
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="text-xs text-gray-400">Good morning,</div>
                <div className="text-lg font-extrabold text-gray-900 mt-0.5">Sarah 👋</div>
              </div>
              <div className="bg-lime-400 rounded-xl px-3 py-2 text-center">
                <div className="text-xl font-extrabold text-green-800 leading-none">7</div>
                <div className="text-[9px] font-bold text-green-700 uppercase tracking-wide">Day streak</div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-4 mb-5 flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <svg width="76" height="76" viewBox="0 0 76 76">
                  <circle cx="38" cy="38" r="30" fill="none" stroke="#d0e8da" strokeWidth="7"/>
                  <circle cx="38" cy="38" r="30" fill="none" stroke="#1a5c38" strokeWidth="7"
                    strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset="32"
                    transform="rotate(-90 38 38)"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-base font-extrabold text-green-700">83%</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800 mb-1">Today's calories</div>
                <div className="text-xs text-gray-500 mb-1">1,240 / 1,500 kcal eaten</div>
                <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{width:'83%'}}/>
                </div>
                <div className="text-xs text-green-600 font-semibold mt-1">260 kcal remaining</div>
              </div>
            </div>

            {[
              { dot: 'bg-green-600',  name: 'Breakfast — Akara + Pap',        cal: '380 kcal' },
              { dot: 'bg-blue-500',   name: 'Lunch — Brown Rice + Egusi',      cal: '480 kcal' },
              { dot: 'bg-yellow-500', name: 'Snack — Roasted Plantain',        cal: '380 kcal' },
            ].map(m => (
              <div key={m.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 mb-2">
                <div className={`w-2 h-2 rounded-full ${m.dot}`}/>
                <div className="flex-1 text-sm font-medium text-gray-800">{m.name}</div>
                <div className="text-xs text-gray-400">{m.cal}</div>
              </div>
            ))}

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2.5 flex items-center gap-2 mt-1">
              <span className="text-yellow-500 text-sm">⚠️</span>
              <span className="text-xs font-medium text-yellow-800">Almost at your limit — keep dinner light!</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="section-badge mb-5">Features</div>
        <div className="max-w-xl mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">Everything you need to hit your goal</h2>
          <p className="text-gray-500 text-lg">Smart tracking, personalised meal planning, and timely nudges — all in one app.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="card hover:-translate-y-1 transition-transform cursor-default">
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="bg-green-600 rounded-4xl px-14 py-16">
          <div className="section-badge mb-5" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)', color: '#b5f23d' }}>
            How it works
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-12">Set up in 3 minutes. Results in 7 days.</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { n: '1', title: 'Tell us about yourself', desc: 'Enter your weight, goal, country, food preferences, and activity level. Takes 3 minutes.' },
              { n: '2', title: 'Get your personalised plan', desc: 'TrimTrack generates a full day-by-day meal plan using foods from your food culture — with calorie counts for every meal.' },
              { n: '3', title: 'Track, eat, and trim', desc: 'Log meals as you go. Watch the ring fill. Get reminders. Hit your targets. Watch the numbers drop each week.' },
            ].map(s => (
              <div key={s.n} className="flex flex-col gap-4">
                <div className="w-11 h-11 rounded-xl bg-lime-400 flex items-center justify-center text-lg font-extrabold text-green-800">{s.n}</div>
                <div className="text-lg font-bold text-white">{s.title}</div>
                <div className="text-sm text-white/60 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="section-badge mb-5">Early feedback</div>
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-10">People using the method are already winning</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="card hover:-translate-y-1 transition-transform">
              <div className="text-yellow-400 text-sm mb-3">★★★★★</div>
              <p className="text-sm text-gray-600 italic leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">{t.initials}</div>
                <div>
                  <div className="font-bold text-sm text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-green-600 to-green-900 rounded-4xl px-14 py-20 text-center">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">Start your journey today</h2>
          <p className="text-white/60 text-lg mb-10">Free to join. No credit card. Your personalised plan in minutes.</p>
          <Link href="/onboarding" className="inline-flex items-center gap-2 bg-lime-400 text-green-800 font-extrabold text-base px-8 py-4 rounded-full hover:bg-lime-300 transition-colors">
            Build my free plan →
          </Link>
          <div className="text-white/30 text-sm mt-4">No spam. Unsubscribe anytime.</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-green-100 py-8 px-6 max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <span className="font-extrabold text-green-700 text-lg">TrimTrack</span>
        <span className="text-sm text-gray-400">© 2026 TrimTrack. All rights reserved.</span>
        <div className="flex gap-5 text-sm text-gray-400">
          <a href="#" className="hover:text-green-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-green-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-green-600 transition-colors">Contact</a>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
