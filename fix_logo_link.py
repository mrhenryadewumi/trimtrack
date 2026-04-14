with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace(
    '<a href="/" style={{ textDecoration: \'none\', fontWeight: 800, fontSize: \'18px\', color: \'#1a5c38\' }}>TrimTrack</a>',
    '<a href="/dashboard" style={{ textDecoration: \'none\', fontWeight: 800, fontSize: \'18px\', color: \'#1a5c38\' }}>TrimTrack</a>'
)

# Also check the other format
d = d.replace(
    'href="/">',
    'href="/dashboard">'
)

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")