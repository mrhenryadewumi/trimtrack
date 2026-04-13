with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Remove all redirects from the profile fetch - never bounce
import re
d = re.sub(
    r"router\.push\(['\"]\/login['\"]\)",
    "console.log('No profile - staying on dashboard')",
    d
)

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")