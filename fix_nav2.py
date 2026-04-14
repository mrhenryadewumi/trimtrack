with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="/login" style={{ fontSize: '13px', color: '#1a5c38', textDecoration: 'none', fontWeight: 600 }}>Login</a>
          <button onClick={() => router.push('/profile')} style={{ fontSize: '12px', color: '#888', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '5px 14px', background: 'white', cursor: 'pointer' }}>
            Edit profile
          </button>
        </div>"""

new = """        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!profile ? (
            <a href="/login" style={{ fontSize: '13px', color: '#1a5c38', textDecoration: 'none', fontWeight: 600 }}>Login</a>
          ) : (
            <button onClick={() => router.push('/profile')} style={{ fontSize: '12px', color: '#1a5c38', border: '1px solid #d1fae5', borderRadius: '20px', padding: '5px 14px', background: '#f0fdf4', cursor: 'pointer', fontWeight: 600 }}>
              {profile.name ? profile.name.split(' ')[0] : 'Profile'}
            </button>
          )}
        </div>"""

if old in d:
    d = d.replace(old, new)
    print("Nav fixed")
else:
    print("Nav pattern not found")
    idx = d.find("Login")
    print(repr(d[idx-100:idx+200]))

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)