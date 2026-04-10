with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """    const saved = localStorage.getItem('trimtrack_profile')
    if (saved) {
      setProfile(JSON.parse(saved))
    }
    // Always sync from API to get latest name and plan
    fetch('/api/profile', { method: 'GET', credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data && data.name) {
          setProfile(data)
          localStorage.setItem('trimtrack_profile', JSON.stringify(data))
        } else if (!saved) {
          router.push('/onboarding')
        }
      })
      .catch(() => { if (!saved) router.push('/onboarding') })"""

new = """    const saved = localStorage.getItem('trimtrack_profile')
    if (saved) {
      // Load from localStorage immediately so UI renders
      try { setProfile(JSON.parse(saved)) } catch(e) {}
    }
    // Sync from API in background
    fetch('/api/profile', { method: 'GET', credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.name) {
          setProfile(data)
          localStorage.setItem('trimtrack_profile', JSON.stringify(data))
        } else if (!saved) {
          // No local data and no session - redirect to login not onboarding
          router.push('/login')
        }
      })
      .catch(() => { if (!saved) router.push('/login') })"""

if old in d:
    d = d.replace(old, new)
    print("SUCCESS")
else:
    print("NOT FOUND")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)