import re

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find all non-ASCII sequences
bad = re.findall(r'[\x80-\xff]+', d)
unique_bad = list(set(bad))
print(f"Found {len(unique_bad)} unique corrupted sequences:")
for b in unique_bad[:10]:
    print(repr(b))
    idx = d.find(b)
    print("Context:", repr(d[idx-30:idx+50]))
    print("---")