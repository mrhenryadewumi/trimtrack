with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """    // Always sync from API to get latest name and plan
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
      .catch(() => { if (!sa"""

print("Looking for fetch block...")
idx = d.find("// Always sync from API")
if idx >= 0:
    print(repr(d[idx:idx+500]))
else:
    print("Not found")