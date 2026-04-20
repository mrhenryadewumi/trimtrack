with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Add darkMode state after other states
old = '  const [showScanner, setShowScanner] = useState(false);'
new = """  const [showScanner, setShowScanner] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const theme = {
    bg: darkMode ? "#0a1310" : "#f6fbf8",
    card: darkMode ? "#162a20" : "#ffffff",
    cardBorder: darkMode ? "rgba(255,255,255,0.04)" : "#e8f5ee",
    text: darkMode ? "#ffffff" : "#0f1f14",
    subtext: darkMode ? "#7a8a82" : "#6b7280",
    accent: "#b5f23d",
    navBg: darkMode ? "rgba(10,19,16,0.95)" : "rgba(246,251,248,0.97)",
    navBorder: darkMode ? "rgba(255,255,255,0.04)" : "#e8f5ee",
  };"""

if old in d:
    d = d.replace(old, new)
    print("State added")
else:
    print("State not found")

# Replace hardcoded bg color on main div
old2 = 'style={{ minHeight: "100vh", background: "#0a1310", color: "white", paddingBottom: "80px" }}'
new2 = 'style={{ minHeight: "100vh", background: theme.bg, color: theme.text, paddingBottom: "80px", transition: "background 0.3s ease" }}'
if old2 in d:
    d = d.replace(old2, new2)
    print("Main bg replaced")
else:
    print("Main bg not found")

# Add toggle button to header - replace the profile avatar section
old3 = '''        <a href="/profile" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #1a5c38, #0f3d25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5f23d", fontWeight: 800, textDecoration: "none", fontSize: "15px", boxShadow: "0 4px 12px rgba(26,92,56,0.4)" }}>
          {profile?.name?.[0]?.toUpperCase() || "U"}
        </a>'''
new3 = '''        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: darkMode ? "#162a20" : "#e8f5ee", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {darkMode ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b5f23d" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a5c38" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <a href="/profile" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #1a5c38, #0f3d25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5f23d", fontWeight: 800, textDecoration: "none", fontSize: "15px", boxShadow: "0 4px 12px rgba(26,92,56,0.4)" }}>
            {profile?.name?.[0]?.toUpperCase() || "U"}
          </a>
        </div>'''

if old3 in d:
    d = d.replace(old3, new3)
    print("Toggle button added")
else:
    print("Avatar not found")

# Update cards to use theme
d = d.replace('background: "linear-gradient(135deg, #162a20 0%, #0e1e16 100%)"', 'background: darkMode ? "linear-gradient(135deg, #162a20 0%, #0e1e16 100%)" : "linear-gradient(135deg, #ffffff 0%, #f0faf4 100%)"')
d = d.replace('background: "#162a20"', 'background: theme.card')
d = d.replace('color: "#7a8a82"', 'color: theme.subtext')
d = d.replace('color: "white"', 'color: theme.text')
d = d.replace('border: "1px solid rgba(255,255,255,0.04)"', 'border: `1px solid ${theme.cardBorder}`')

# Nav
d = d.replace(
    'background: "rgba(10,19,16,0.95)"',
    'background: theme.navBg'
)
d = d.replace(
    'borderTop: "1px solid rgba(255,255,255,0.04)"',
    'borderTop: `1px solid ${theme.navBorder}`'
)

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")