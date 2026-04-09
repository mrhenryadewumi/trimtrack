with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'rb') as f:
    raw = f.read()

# Find where 'use client' starts and strip everything before it
marker = b"'use client'"
idx = raw.find(marker)
if idx > 0:
    raw = raw[idx:]
    print(f"Stripped {idx} bytes from start")
else:
    print("No BOM found")

with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'wb') as f:
    f.write(raw)
print('Done')