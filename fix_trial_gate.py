with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Add trial expiry check to profile load
old = """        if (apiProfile?.name) { setProfile(apiProfile)
          localStorage.setItem('trimtrack_profile', JSON.stringify(data))"""

new = """        if (apiProfile?.name) { setProfile(apiProfile)
          localStorage.setItem('trimtrack_profile', JSON.stringify(data))
          // Check trial expiry
          if (apiProfile.trial_ends_at && apiProfile.plan === 'trial') {
            const trialEnd = new Date(apiProfile.trial_ends_at)
            if (new Date() > trialEnd) {
              window.location.href = '/upgrade'
            }
          }"""

if old in d:
    d = d.replace(old, new)
    print("Trial check added")
else:
    print("Pattern not found - searching")
    idx = d.find("apiProfile?.name")
    print(repr(d[idx:idx+200]))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)