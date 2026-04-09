import re

# Fix FoodSearch.tsx
with open(r'C:\Users\mrhen\trimtrack\components\FoodSearch.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Replace any flag emoji variants with plain text
d = re.sub(r"food\.source === 'local' \? '[^']*' : '[^']*'", "food.source === 'local' ? 'NG' : 'GL'", d)
# Replace middle dot separators with dash
d = re.sub(r'(\{food\.protein\}g P)[\s\S]{1,10}?(\{food\.carbs\}g C)', r'\1 - \2', d)
d = re.sub(r'(\{food\.carbs\}g C)[\s\S]{1,10}?(\{food\.fat\}g F)', r'\1 - \2', d)

with open(r'C:\Users\mrhen\trimtrack\components\FoodSearch.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print('FoodSearch fixed')

# Fix dashboard
with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

d = re.sub(r'kcal left\s*[^\s{]+\s*\{eaten', 'kcal left - {eaten', d)

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print('Dashboard fixed')