with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Fix fetchMeals to always return array
d = d.replace(
    "fetchMeals().then(data => setMeals(data || []));",
    "fetchMeals().then(data => { const arr = Array.isArray(data) ? data : (data?.data || data?.meals || []); setMeals(Array.isArray(arr) ? arr : []); }).catch(() => setMeals([]));"
)

# Make reduce calls safe
d = d.replace(
    "const eaten = meals.reduce((s, m) => s + (m.kcal || 0), 0);",
    "const mealsArray = Array.isArray(meals) ? meals : [];\n  const eaten = mealsArray.reduce((s, m) => s + (m.kcal || 0), 0);"
)
d = d.replace(
    "const protein = Math.round(meals.reduce((s, m) => s + (m.protein || 0), 0));",
    "const protein = Math.round(mealsArray.reduce((s, m) => s + (m.protein || 0), 0));"
)
d = d.replace(
    "const carbs = Math.round(meals.reduce((s, m) => s + (m.carbs || 0), 0));",
    "const carbs = Math.round(mealsArray.reduce((s, m) => s + (m.carbs || 0), 0));"
)
d = d.replace(
    "const fat = Math.round(meals.reduce((s, m) => s + (m.fat || 0), 0));",
    "const fat = Math.round(mealsArray.reduce((s, m) => s + (m.fat || 0), 0));"
)
d = d.replace("meals.length > 0", "mealsArray.length > 0")
d = d.replace("meals.map((meal, i)", "mealsArray.map((meal, i)")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")