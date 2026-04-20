with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('setDarkMode(!darkMode)')
# Find the button block and replace it cleanly
import re
pattern = r'<button onClick=\{\(\) => setDarkMode\(!darkMode\)\}.*?</button>'
replacement = '''<button onClick={() => setDarkMode(!darkMode)}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: darkMode ? "#162a20" : "#e8f5ee", border: "none", cursor: "pointer", fontSize: "15px", fontWeight: 700, color: darkMode ? "#b5f23d" : "#1a5c38" }}>
            {darkMode ? "Day" : "Night"}
          </button>'''

d_new = re.sub(pattern, replacement, d, flags=re.DOTALL)
if d_new != d:
    print("Fixed")
else:
    print("No change")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d_new)