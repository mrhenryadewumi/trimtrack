with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """          {!profile ? (
            <a href="/login" style={{ fontSize: '13px', color: '#1a5c38', textDecoration: 'none', fontWeight: 600 }}>Login</a>
          ) : (
            <button onClick={() => router.push('/profile')} style={{ fontSize: '12px', color: '#1a5c38', border: '1px solid #d1fae5', borderRadius: '20px', padding: '5px 14px', background: '#f0fdf4', cursor: 'pointer', fontWeight: 600 }}>
              {profile.name ? profile.name.split(' ')[0] : 'Profile'}
            </button>
          )}"""

new = """          {profile ? (
            <button onClick={() => router.push('/profile')} style={{ fontSize: '12px', color: '#1a5c38', border: '1px solid #d1fae5', borderRadius: '20px', padding: '5px 14px', background: '#f0fdf4', cursor: 'pointer', fontWeight: 600 }}>
              {profile.name ? profile.name.split(' ')[0] : 'Profile'}
            </button>
          ) : (
            <a href="/login" style={{ fontSize: '13px', color: '#1a5c38', textDecoration: 'none', fontWeight: 600 }}>Login</a>
          )}"""

if old in d:
    d = d.replace(old, new)
    print("Fixed")
else:
    print("Pattern not found")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)