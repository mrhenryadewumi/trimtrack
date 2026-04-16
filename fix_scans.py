import re

# Fix subscription route
with open(r'C:\Users\mrhen\trimtrack\app\api\subscription\route.ts', 'r', encoding='utf-8') as f:
    d = f.read()

# Replace scan limit of 3 with 6
d = d.replace('scan_count_today >= 3', 'scan_count_today >= 6')
d = d.replace('scansLeft: 3 -', 'scansLeft: 6 -')
d = d.replace('scansLeft: Math.max(0, 3 -', 'scansLeft: Math.max(0, 6 -')
d = re.sub(r'(scansLeft:\s*)3(\s*-\s*)', r'\g<1>6\2', d)
d = re.sub(r'(>=\s*)3(\s*\))', r'\g<1>6\2', d)

with open(r'C:\Users\mrhen\trimtrack\app\api\subscription\route.ts', 'w', encoding='utf-8') as f:
    f.write(d)
print("Subscription route updated")

# Fix dashboard
with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace('const [scansLeft, setScansLeft] = useState(3)', 'const [scansLeft, setScansLeft] = useState(6)')
d = d.replace("scansLeft} free scan", "scansLeft} free scan")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Dashboard updated")