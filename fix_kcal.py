with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = "kcal left - {eaten.toLocaleString()} eaten of ${goal.toLocaleString()}"
new = "kcal left - ${eaten.toLocaleString()} eaten of ${goal.toLocaleString()}"

if old in d:
    d = d.replace(old, new)
    print("FIXED")
else:
    print("NOT FOUND")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)