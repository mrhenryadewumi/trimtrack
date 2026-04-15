with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = "    const savedMeals = localStorage.getItem('trimtrack_meals_today')\n    if (savedMeals) { try { setMeals(JSON.parse(savedMeals)) } catch(e) {} }"

new = """    const now = new Date()
    const localToday = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0')
    const savedMealsDate = localStorage.getItem('trimtrack_meals_date')
    const savedMeals = localStorage.getItem('trimtrack_meals_today')
    if (savedMeals && savedMealsDate === localToday) {
      try { setMeals(JSON.parse(savedMeals)) } catch(e) {}
    } else {
      localStorage.removeItem('trimtrack_meals_today')
      localStorage.setItem('trimtrack_meals_date', localToday)
    }"""

if old in d:
    d = d.replace(old, new)
    print("FIXED")
else:
    print("NOT FOUND")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)