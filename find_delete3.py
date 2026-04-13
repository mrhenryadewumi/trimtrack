with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('removeEntry')
if idx < 0:
    idx = d.find('handleRemove')
if idx < 0:
    # Find button near delete
    idx = d.find('onClick={() => remove')
if idx < 0:
    # Search for the meal item render
    idx = d.find('entry.kcal')
    
if idx >= 0:
    print(repr(d[idx-100:idx+300]))
else:
    print("Not found - searching for kcal display")
    idx = d.find('m.kcal')
    print(repr(d[idx-50:idx+300]) if idx >= 0 else "not found")