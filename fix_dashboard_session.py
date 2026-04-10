with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """  useEffect(() => {
    const saved = localStorage.getItem('trimtrack_profile')
    if (!saved) { router.push('/onboarding'); return }
    setProfile(JSON.parse(saved))"""

new = """  useEffect(() => {
    const saved = localStorage.getItem('trimtrack_profile')
    if (!saved) {
      // Try loading from API using session cookie
      fetch('/api/profile', { method: 'GET', credentials: 'include' })
        .then(r => r.json())
        .then(data => {
          if (data && data.name) {
            setProfile(data)
            localStorage.setItem('trimtrack_profile', JSON.stringify(data))
          } else {
            router.push('/onboarding')
          }
        })
        .catch(() => router.push('/onboarding'))
      return
    }
    setProfile(JSON.parse(saved))"""

if old in d:
    d = d.replace(old, new)
    print("SUCCESS")
else:
    print("PATTERN NOT FOUND")
    idx = d.find("trimtrack_profile")
    print(repr(d[idx-50:idx+200]))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)