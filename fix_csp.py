with open(r'C:\Users\mrhen\trimtrack\middleware.ts', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace(
    "style-src 'self' 'unsafe-inline';",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
)

with open(r'C:\Users\mrhen\trimtrack\middleware.ts', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")