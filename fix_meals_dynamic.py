with open(r'C:\Users\mrhen\trimtrack\app\api\meals\route.ts', 'r', encoding='utf-8') as f:
    d = f.read()

if 'force-dynamic' not in d:
    d = 'export const dynamic = "force-dynamic";\n' + d
    print("Added force-dynamic")
else:
    print("Already has force-dynamic")

with open(r'C:\Users\mrhen\trimtrack\app\api\meals\route.ts', 'w', encoding='utf-8') as f:
    f.write(d)