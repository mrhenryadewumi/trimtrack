with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('trimtrack_meals_date')
if idx >= 0:
    print("Date check found:")
    print(repr(d[idx-200:idx+300]))
else:
    print("trimtrack_meals_date NOT FOUND in dashboard")
    idx2 = d.find('savedMeals')
    print(repr(d[idx2-50:idx2+300]))