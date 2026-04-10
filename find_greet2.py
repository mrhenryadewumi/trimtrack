with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('getGreeting()')
if idx >= 0:
    print(repr(d[idx-20:idx+200]))
else:
    idx = d.find('Good ')
    if idx >= 0:
        print(repr(d[idx-50:idx+200]))
    else:
        print("greeting not found in JSX")
        idx = d.find('morning')
        print(repr(d[idx-50:idx+200]) if idx >= 0 else "not found")