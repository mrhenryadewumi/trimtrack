with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()
print(f"Total lines: {len(d.split(chr(10)))}")
print(f"Total chars: {len(d)}")
# Show imports and state declarations
lines = d.split('\n')
for i, line in enumerate(lines[:50]):
    print(f"{i+1}: {line}")