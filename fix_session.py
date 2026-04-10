with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find localStorage sessionId usage and add cookie fallback
old = """  useEffect(() => {
    const sid = localStorage.getItem('sessionId') || localStorage.getItem('trimtrack_session_id')"""

new = """  useEffect(() => {
    // Read session from cookie first, fall back to localStorage
    const cookieSession = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('trimtrack_session='))?.split('=')[1];
    const sid = cookieSession || localStorage.getItem('sessionId') || localStorage.getItem('trimtrack_session_id')"""

if old in d:
    d = d.replace(old, new)
    print("Replaced successfully")
else:
    # Find what useEffect looks like
    idx = d.find('useEffect')
    print("useEffect context:")
    print(repr(d[idx:idx+200]))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)