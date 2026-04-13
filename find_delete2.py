import re
with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find delete button area
idx = d.find('deleteMeal(')
while idx >= 0:
    print(repr(d[idx-150:idx+150]))
    print("---")
    idx = d.find('deleteMeal(', idx+1)