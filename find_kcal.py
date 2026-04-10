with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('kcal left')
if idx >= 0:
    print("Found 'kcal left':")
    print(repr(d[idx-50:idx+150]))
else:
    print("'kcal left' not found")
    
idx2 = d.find('remain')
if idx2 >= 0:
    print("\nFound 'remain':")
    print(repr(d[idx2-20:idx2+200]))