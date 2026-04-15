# Fix 3 - dashboard: clear stale localStorage meals from previous days
with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = "    const savedMeals = localStorage.getItem('trimtrack_meals_today')\n    if (savedMeals) setMeals(JSON.parse(savedMeals))"

new = """    // Only load cached meals if they are from today (local date)
    const now = new Date()
    const localToday = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0')
    const savedMeals = localStorage.getItem('trimtrack_meals_today')
    const savedMealsDate = localStorage.getItem('trimtrack_meals_date')
    if (savedMeals && savedMealsDate === localToday) {
      setMeals(JSON.parse(savedMeals))
    } else {
      // Clear stale meals from previous day
      localStorage.removeItem('trimtrack_meals_today')
      localStorage.setItem('trimtrack_meals_date', localToday)
    }"""

if old in d:
    d = d.replace(old, new)
    print("Dashboard stale meals fix applied")
else:
    print("Dashboard pattern not found")
    idx = d.find("savedMeals")
    print(repr(d[idx-30:idx+200]))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)