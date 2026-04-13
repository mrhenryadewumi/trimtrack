import re

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

bad = re.findall(r'[\x80-\xff]+', d)
print(f"Bad sequences: {len(set(bad))}")
for b in set(bad):
    idx = d.find(b)
    print(repr(d[idx-30:idx+30]))