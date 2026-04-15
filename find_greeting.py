with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find greeting section
idx = d.find("GREETING")
print("GREETING context:")
print(repr(d[idx:idx+300]))