with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace("const plan = getDailyPlan(profile.country)", "const plan = getDailyPlan(profile?.country || '')")
d = d.replace("getExercises(profile.activity)", "getExercises(profile?.activity || 'light')")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")