with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = '<PhotoScanner activeMeal={activeMeal} onClose={() => setShowScanner(false)} onAdd={(food: any) => { addFood(food); setShowScanner(false); }} />'
new = '<PhotoScanner mealType={activeMeal} onAdd={(food: any) => { addFood(food); setShowScanner(false); }} />'

if old in d:
    d = d.replace(old, new)
    print("Fixed")
else:
    print("Pattern not found")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)