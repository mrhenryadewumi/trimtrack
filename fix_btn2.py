with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find current button and replace entire header section
old = '''      {/* HEADER */}
      <div style={{ padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: sub, letterSpacing: "0.15em", marginBottom: "2px" }}>TRIMTRACK</div>
          <div style={{ fontSize: "13px", color: sub }}>{today}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ padding: "7px 14px", borderRadius: "99px", background: dk ? "#b5f23d" : "#1a5c38", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 800, color: dk ? "#0a1310" : "#ffffff" }}>
            {dk ? "Day" : "Night"}
          </button>
          <a href="/profile" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #1a5c38, #0f3d25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5f23d", fontWeight: 800, textDecoration: "none", fontSize: "15px" }}>
            {profile?.name?.[0]?.toUpperCase() || "U"}
          </a>
        </div>
      </div>'''

new = '''      {/* HEADER */}
      <div style={{ padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: sub, letterSpacing: "0.15em", marginBottom: "2px" }}>TRIMTRACK</div>
          <div style={{ fontSize: "13px", color: sub }}>{today}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setDarkMode(m => !m)}
            style={{ padding: "7px 16px", borderRadius: "99px", background: darkMode ? "#b5f23d" : "#1a5c38", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 800, color: darkMode ? "#0a1310" : "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            {darkMode ? "Day" : "Night"}
          </button>
          <a href="/profile" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #1a5c38, #0f3d25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5f23d", fontWeight: 800, textDecoration: "none", fontSize: "15px" }}>
            {profile?.name?.[0]?.toUpperCase() || "U"}
          </a>
        </div>
      </div>'''

if old in d:
    d = d.replace(old, new)
    print("Fixed")
else:
    print("Not found")
    idx = d.find("HEADER")
    print(repr(d[idx:idx+400]))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)