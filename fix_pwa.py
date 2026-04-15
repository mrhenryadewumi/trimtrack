with open(r'C:\Users\mrhen\trimtrack\app\layout.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Fix deprecated apple-mobile-web-app-capable
d = d.replace(
    '<meta name="apple-mobile-web-app-capable" content="yes" />',
    '<meta name="apple-mobile-web-app-capable" content="yes" />\n        <meta name="mobile-web-app-capable" content="yes" />'
)

# Fix description
d = d.replace(
    'The only calorie tracker that knows Nigerian food.',
    'AI calorie tracking built for African food culture.'
)
d = d.replace(
    "Nigerian food",
    "African food"
)

with open(r'C:\Users\mrhen\trimtrack\app\layout.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")