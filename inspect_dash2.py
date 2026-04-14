with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Get all lines after line 50 to see full file
lines = d.split('\n')
for i, line in enumerate(lines[50:], start=51):
    print(f"{i}: {line}")