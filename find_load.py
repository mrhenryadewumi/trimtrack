with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find the exact load pattern
old = """    const savedMeals = localStorage.getItem('trimtrack_meals_today')
    if (savedMeals) { try { setMeals("""

idx = d.find(old)
print(f"Found at: {idx}")
if idx >= 0:
    print(repr(d[idx:idx+200]))