with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('localStorage')
print("localStorage context:")
print(repr(d[idx-100:idx+300]))