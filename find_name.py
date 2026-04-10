with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find profile.name usage in JSX
idx = d.find('profile.name')
while idx >= 0:
    print(repr(d[idx-30:idx+100]))
    print("---")
    idx = d.find('profile.name', idx+1)