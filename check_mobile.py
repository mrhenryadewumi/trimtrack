with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Check viewport meta and container widths
idx = d.find('maxWidth')
print("Container:")
print(repr(d[idx:idx+100]))

idx2 = d.find('max-w-')
print("Tailwind max-w:")
print(repr(d[idx2:idx2+100]))