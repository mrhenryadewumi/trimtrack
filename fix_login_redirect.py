with open(r'C:\Users\mrhen\trimtrack\app\login\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """      if (data.ok) {
        if (data.sessionId) localStorage.setItem("sessionId", data.sessionId);
        router.push("/dashboard");"""

new = """      if (data.ok) {
        if (data.sessionId) {
          localStorage.setItem("sessionId", data.sessionId);
          localStorage.setItem("trimtrack_session_id", data.sessionId);
        }
        if (data.name) {
          localStorage.setItem("trimtrack_profile", JSON.stringify({ name: data.name, plan: data.plan }));
        }
        router.push("/dashboard");"""

if old in d:
    d = d.replace(old, new)
    print("Login fixed")
else:
    print("Pattern not found")
    idx = d.find("data.ok")
    print(repr(d[idx:idx+200]))

with open(r'C:\Users\mrhen\trimtrack\app\login\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)