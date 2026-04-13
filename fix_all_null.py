import re
with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Fix ALL profile. usages in JSX to use optional chaining
# These are all the patterns that can crash when profile is null
patterns = [
    (r'\{profile\.reminders\b', '{profile?.reminders'),
    (r'\{profile\.activity\b', '{profile?.activity'),
    (r'\{profile\.country\b', '{profile?.country'),
    (r'\{profile\.name\b', '{profile?.name'),
    (r'\{profile\.dailyCalorieGoal\b', '{profile?.dailyCalorieGoal'),
    (r'\{profile\.goalWeight\b', '{profile?.goalWeight'),
    (r'\{profile\.startWeight\b', '{profile?.startWeight'),
    (r'\bprofile\.reminders\b', 'profile?.reminders'),
    (r'\bprofile\.activity\b', 'profile?.activity'),
    (r'\bprofile\.country\b', 'profile?.country'),
    (r'\bprofile\.name\b', 'profile?.name'),
    (r'\bprofile\.dailyCalorieGoal\b', 'profile?.dailyCalorieGoal'),
    (r'\bprofile\.goalWeight\b', 'profile?.goalWeight'),
    (r'\bprofile\.startWeight\b', 'profile?.startWeight'),
    (r'\bprofile\.height\b', 'profile?.height'),
    (r'\bprofile\.age\b', 'profile?.age'),
    (r'\bprofile\.gender\b', 'profile?.gender'),
    (r'\bprofile\.avoidFoods\b', 'profile?.avoidFoods'),
    (r'\bprofile\.drink\b', 'profile?.drink'),
]

for pattern, replacement in patterns:
    d = re.sub(pattern, replacement, d)

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")