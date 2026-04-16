with open(r'C:\Users\mrhen\trimtrack\lib\foods.ts', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace("category: 'snacks'", "category: 'snack'")
d = d.replace("category: 'drinks'", "category: 'drink'")

with open(r'C:\Users\mrhen\trimtrack\lib\foods.ts', 'w', encoding='utf-8') as f:
    f.write(d)
print("Fixed")