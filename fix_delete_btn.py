with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = '<button onClick={() => removeFood(m.key, ii)} className="text-gray-300 hover:text-red-400 text-lg leading-none ml-1">\u201a\u20ac</button>'

new = '''<button onClick={() => removeFood(m.key, ii)} className="text-gray-300 hover:text-red-400 ml-2" style={{background:"none",border:"none",cursor:"pointer",padding:"2px",display:"flex",alignItems:"center"}}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>'''

if old in d:
    d = d.replace(old, new)
    print("FIXED")
else:
    # Try without the unicode escape
    import re
    pattern = r'<button onClick=\{.*?removeFood.*?\}.*?>.*?</button>'
    matches = re.findall(pattern, d)
    print("Pattern not found, found these buttons:")
    for m in matches[:3]:
        print(repr(m))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)