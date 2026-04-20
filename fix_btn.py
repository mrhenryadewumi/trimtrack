with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = 'style={{ padding: "6px 12px", borderRadius: "99px", background: card, border: `1px solid ${cardBorder}`, cursor: "pointer", fontSize: "12px", fontWeight: 700, color: dk ? "#b5f23d" : "#1a5c38" }}'
new = 'style={{ padding: "7px 14px", borderRadius: "99px", background: dk ? "#b5f23d" : "#1a5c38", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 800, color: dk ? "#0a1310" : "#ffffff" }}'

if old in d:
    d = d.replace(old, new)
    print("Fixed")
else:
    print("Not found")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)