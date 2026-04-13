with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find and fix all remaining profile. references that need optional chaining
import re

# Fix profile.country in JSX
d = re.sub(r"\{profile\.country(\s*\|\|)", r"{profile?.country\1", d)

# Fix profile.name in JSX  
d = re.sub(r"\{profile\.name(\s*\|\|)", r"{profile?.name\1", d)

# Fix profile.dailyCalorieGoal
d = re.sub(r"profile\.dailyCalorieGoal", "profile?.dailyCalorieGoal", d)

# Fix encoding corruption on that line - remove the mojibake
d = re.sub(r'Today\'s meal plan [^\{]+\{', "Today's meal plan - {", d)

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")