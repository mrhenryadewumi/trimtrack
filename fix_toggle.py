with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """          <button onClick={() => setDarkMode(!darkMode)}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: darkMode ? "#162a20" : "#e8f5ee", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {darkMode ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b5f23d" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a5c38" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>"""

new = """          <button onClick={() => setDarkMode(!darkMode)}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: darkMode ? "#162a20" : "#e8f5ee", border: "none", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {darkMode ? "\u2600\ufe0f" : "\ud83c\udf19"}
          </button>"""

if old in d:
    d = d.replace(old, new)
    print("Fixed")
else:
    print("Pattern not found - trying partial match")
    idx = d.find('setDarkMode(!darkMode)')
    print(repr(d[idx:idx+500]))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)