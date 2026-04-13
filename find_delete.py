import re
with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find the delete button in meal items
idx = d.find('handleDelete')
if idx >= 0:
    print("Delete context:")
    print(repr(d[idx-100:idx+200]))
else:
    print("handleDelete not found")
    idx = d.find('deleteMeal')
    print(repr(d[idx-50:idx+200]) if idx >= 0 else "deleteMeal not found")