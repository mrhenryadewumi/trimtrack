with open(r'C:\Users\mrhen\trimtrack\lib\api-client.ts', 'r', encoding='utf-8') as f:
    d = f.read()

# Fix deleteMeal - send id in body not query param
old = "  const res = await fetch(`/api/meals?id=${id}`, { method: 'DELETE' })"
new = """  const res = await fetch('/api/meals', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })"""

if old in d:
    d = d.replace(old, new)
    print("deleteMeal fixed")
else:
    print("deleteMeal pattern not found")

with open(r'C:\Users\mrhen\trimtrack\lib\api-client.ts', 'w', encoding='utf-8') as f:
    f.write(d)