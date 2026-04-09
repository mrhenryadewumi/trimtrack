with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = '''          <button onClick={() => router.push('/onboarding')} className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1.5">
            Edit profile
          </button>
        </div>
      </nav>'''

new = '''          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <a href="/login" style={{fontSize:"12px",color:"#1a5c38",fontWeight:"600",textDecoration:"none"}}>Login</a>
            <button onClick={() => router.push('/onboarding')} className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1.5">
              Edit profile
            </button>
          </div>
        </div>
      </nav>'''

if old in d:
    d = d.replace(old, new)
    print("SUCCESS")
else:
    print("FAILED")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)