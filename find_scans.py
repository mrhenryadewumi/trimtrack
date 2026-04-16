import os

files_to_check = [
    r'C:\Users\mrhen\trimtrack\app\api\subscription\route.ts',
    r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx',
]

for f in files_to_check:
    if os.path.exists(f):
        with open(f, encoding='utf-8') as fh:
            d = fh.read()
        if '3' in d and 'scan' in d.lower():
            print(f"Found scan limit in: {f}")
            # Show context
            import re
            matches = re.findall(r'.{50}scan.{50}', d, re.IGNORECASE)
            for m in matches[:3]:
                print(repr(m))
            print()