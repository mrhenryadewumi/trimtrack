with open(r'C:\Users\mrhen\trimtrack\app\api\trial\route.ts', 'r', encoding='utf-8') as f:
    d = f.read()

# Find what the error returns look like
import re
errors = re.findall(r'return NextResponse\.json\([^)]+\)', d)
for e in errors:
    print(e)