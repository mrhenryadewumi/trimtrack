with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    old = f.read()

if old.startswith('\ufeff'):
    old = old[1:]

# Find all occurrences of "return ("
import re
matches = [(m.start(), old[m.start():m.start()+100]) for m in re.finditer(r'\n  return \(', old)]
for idx, ctx in matches:
    print(f"Index {idx}: {repr(ctx[:80])}")