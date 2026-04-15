import os

files = [
    r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx',
    r'C:\Users\mrhen\trimtrack\app\login\page.tsx',
    r'C:\Users\mrhen\trimtrack\app\trial\page.tsx',
    r'C:\Users\mrhen\trimtrack\app\profile\page.tsx',
    r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx',
]

for f in files:
    if os.path.exists(f):
        with open(f, encoding="utf-8") as fh:
            d = fh.read()
        lines = len(d.split("\n"))
        # Check for viewport-breaking patterns
        has_fixed_width = "width:" in d and "px" in d
        has_overflow = "overflow" in d
        print(f"{os.path.basename(os.path.dirname(f))}/{os.path.basename(f)} - {lines} lines - fixed_width:{has_fixed_width} overflow:{has_overflow}")