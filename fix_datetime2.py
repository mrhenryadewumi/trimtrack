with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """        {/* HERO CALORIE CARD */}"""

new = """        {/* DATE AND TIME */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '-8px' }}>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{today}</p>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a5c38', margin: 0 }}>{currentTime}</p>
        </div>

        {/* HERO CALORIE CARD */}"""

if old in d:
    d = d.replace(old, new)
    print("FIXED")
else:
    print("NOT FOUND")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)