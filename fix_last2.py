import re

files = [
    r'C:\Users\mrhen\trimtrack\app\trial\page.tsx',
    r'C:\Users\mrhen\trimtrack\lib\calculations.ts',
]

for filepath in files:
    with open(filepath, 'rb') as f:
        raw = f.read()
    text = raw.decode('utf-8', errors='replace')
    text = re.sub(r'[\x80-\xff]', '', text)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Fixed: {filepath.split(chr(92))[-1]}")

print("Done")