with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Add motivation and statement state variables
old = "  const [activeTab, setActiveTab] = useState<'log' | 'progress' | 'plan'>('log')"
new = """  const [activeTab, setActiveTab] = useState<'log' | 'progress' | 'plan'>('log')
  const [motivation, setMotivation] = useState<string>("")
  const [today, setToday] = useState<string>("")
  const [userTimezone, setUserTimezone] = useState<string>("UTC")"""

if old in d:
    d = d.replace(old, new)
    print("State vars added")
else:
    print("State vars - pattern not found")

# Add motivation fetch and midnight reset to useEffect
old = "    fetchWeights().then(res => {"
new = """    // Detect timezone and set today's date
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(tz)
    const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    setToday(todayStr)

    // Schedule midnight reset
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const msToMidnight = midnight.getTime() - now.getTime()
    const midnightTimer = setTimeout(() => {
      setMeals({ breakfast: [], lunch: [], snack: [], dinner: [] })
      localStorage.removeItem('trimtrack_meals_today')
      window.location.reload()
    }, msToMidnight)

    fetchWeights().then(res => {"""

if old in d:
    d = d.replace(old, new)
    print("Midnight reset added")
else:
    print("Midnight reset - pattern not found")

# Close the timer cleanup
old = "  }, [router, saveMealsLocal])"
new = """    return () => clearTimeout(midnightTimer)
  }, [router, saveMealsLocal])"""

if old in d:
    d = d.replace(old, new)
    print("Timer cleanup added")
else:
    print("Timer cleanup - pattern not found")

# Add motivation fetch after eaten/goal calculations
old = "  const status = getCalorieStatus(eaten, goal)"
new = """  const status = getCalorieStatus(eaten, goal)

  useEffect(() => {
    fetch(`/api/motivation?eaten=${eaten}&goal=${goal}`)
      .then(r => r.json())
      .then(data => setMotivation(data.message || ""))
      .catch(() => {})
  }, [eaten, goal])

  // Save daily statement when meals change
  useEffect(() => {
    if (eaten === 0 || !profile) return
    const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') || '' : ''
    if (!sessionId) return
    const allM = Object.values(meals).flat()
    fetch('/api/statements', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        date: new Date().toISOString().split('T')[0],
        timezone: userTimezone,
        total_kcal: eaten,
        total_protein: Math.round(allM.reduce((s, m) => s + m.protein, 0)),
        total_carbs: Math.round(allM.reduce((s, m) => s + m.carbs, 0)),
        total_fat: Math.round(allM.reduce((s, m) => s + m.fat, 0)),
        goal_kcal: goal,
        meals_count: allM.length,
      })
    }).catch(() => {})
  }, [eaten])"""

if old in d:
    d = d.replace(old, new)
    print("Statement saving added")
else:
    print("Statement saving - pattern not found")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)