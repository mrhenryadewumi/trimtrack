with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

fixes = [
    # Safe eaten calculation
    (
        'const eaten = allMeals.reduce((s, m) => s + m.kcal, 0)',
        'const eaten = (allMeals ?? []).reduce((s, m) => s + (m.kcal || 0), 0)'
    ),
    # Safe remain
    (
        'const remain = goal - eaten',
        'const remain = (goal || 1500) - (eaten || 0)'
    ),
    # Safe pct
    (
        'const pct = Math.min(100, Math.round((eaten / goal) * 100))',
        'const pct = goal > 0 ? Math.min(100, Math.round(((eaten || 0) / goal) * 100)) : 0'
    ),
    # Safe profile name
    (
        'getGreeting(profile.name)',
        'getGreeting(profile?.name || "there")'
    ),
    # Safe goal
    (
        'const goal = profile?.dailyCalorieGoal ?? 1500',
        'const goal = profile?.dailyCalorieGoal || profile?.goal_weight || 1500'
    ),
]

count = 0
for old, new in fixes:
    if old in d:
        d = d.replace(old, new)
        print(f"Fixed: {old[:50]}")
        count += 1
    else:
        print(f"NOT FOUND: {old[:50]}")

print(f"\nTotal fixes: {count}")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)