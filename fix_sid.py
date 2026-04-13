with open(r'C:\Users\mrhen\trimtrack\app\api\trial\route.ts', 'r', encoding='utf-8') as f:
    d = f.read()

old = "    const sid = sessionId || Math.random().toString(36).slice(2);"
new = "    const sid = Math.random().toString(36).slice(2) + Date.now().toString(36);"

if old in d:
    d = d.replace(old, new)
    print("Fixed session_id generation")
else:
    print("Pattern not found")
    idx = d.find("const sid")
    print(repr(d[idx:idx+100]))

with open(r'C:\Users\mrhen\trimtrack\app\api\trial\route.ts', 'w', encoding='utf-8') as f:
    f.write(d)