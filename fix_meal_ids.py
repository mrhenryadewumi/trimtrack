with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find addFood function and fix id storage
old = """    try {
      const result = await saveMeal({ meal_type: activeMeal, food_name: food.name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat })
      if (result?.data?.id) {
        const withId = { ...updated, [activeMeal]: updated[activeMeal].map((e, i) => i === updated[activeMeal].length - 1 ? { ...e, id: result.data.id } : e) }
        setMeals(withId); saveMealsLocal(withId)
      }
    } catch (e) { console.error(e) }"""

new = """    try {
      const result = await saveMeal({ meal_type: activeMeal, food_name: food.name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat })
      const savedId = result?.data?.id || result?.id
      if (savedId) {
        const withId = { ...updated, [activeMeal]: updated[activeMeal].map((e, i) => i === updated[activeMeal].length - 1 ? { ...e, id: savedId } : e) }
        setMeals(withId); saveMealsLocal(withId)
      }
    } catch (e) { console.error(e) }"""

if old in d:
    d = d.replace(old, new)
    print("addFood id storage fixed")
else:
    print("addFood pattern not found")

# Also fix handlePhotoAdd to store id
old2 = """    try { await saveMeal({ meal_type: activeMeal, food_name: food.food_name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat }) } catch (e) { console.error(e) }"""

new2 = """    try {
      const result = await saveMeal({ meal_type: activeMeal, food_name: food.food_name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat })
      const savedId = result?.data?.id || result?.id
      if (savedId) {
        const withId = { ...updated, [activeMeal]: updated[activeMeal].map((e, i) => i === updated[activeMeal].length - 1 ? { ...e, id: savedId } : e) }
        setMeals(withId); saveMealsLocal(withId)
      }
    } catch (e) { console.error(e) }"""

if old2 in d:
    d = d.replace(old2, new2)
    print("handlePhotoAdd id storage fixed")
else:
    print("handlePhotoAdd pattern not found")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)