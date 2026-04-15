# Fix 4 - dashboard: also save date when saving meals
with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = "  const saveMealsLocal = useCallback((m: Record<MealType, MealEntry[]>) => {\n    localStorage.setItem('trimtrack_meals_today', JSON.stringify(m))\n  }, [])"

new = """  const saveMealsLocal = useCallback((m: Record<MealType, MealEntry[]>) => {
    const now = new Date()
    const localToday = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0')
    localStorage.setItem('trimtrack_meals_today', JSON.stringify(m))
    localStorage.setItem('trimtrack_meals_date', localToday)
  }, [])"""

if old in d:
    d = d.replace(old, new)
    print("saveMealsLocal date stamp added")
else:
    print("saveMealsLocal pattern not found")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)