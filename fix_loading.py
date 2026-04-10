with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = "  if (!profile) return (\n    <div className=\"min-h-screen flex items-center justify-center bg-[#f6fbf8]\">\n      <div className=\"text-green-600 font-semibold animate-pulse\">Loading...</div>\n    </div>\n  )"

new = """  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6fbf8]">
      <div style={{ textAlign: "center" }}>
        <div className="text-green-600 font-semibold animate-pulse mb-4">Loading...</div>
        <a href="/login" style={{ fontSize: "13px", color: "#1a5c38", textDecoration: "none" }}>
          Not loading? Click here to log in
        </a>
      </div>
    </div>
  )"""

if old in d:
    d = d.replace(old, new)
    print("Loading screen fixed")
else:
    print("Pattern not found")
    idx = d.find("Loading...")
    print(repr(d[idx-100:idx+100]))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)