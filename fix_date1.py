# Fix 1 - api-client.ts: use local date not UTC
with open(r'C:\Users\mrhen\trimtrack\lib\api-client.ts', 'r', encoding='utf-8') as f:
    d = f.read()

old = "  const dateStr = date || new Date().toISOString().split('T')[0]"
new = """  const now = new Date()
  const localDate = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0')
  const dateStr = date || localDate"""

if old in d:
    d = d.replace(old, new)
    print("api-client date fixed")
else:
    print("api-client pattern not found")

with open(r'C:\Users\mrhen\trimtrack\lib\api-client.ts', 'w', encoding='utf-8') as f:
    f.write(d)