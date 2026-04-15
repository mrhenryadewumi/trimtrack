import re

# Fix dashboard - replace fixed pixel widths with responsive equivalents
with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Main container - already 480px which is fine
# Fix the circular ring - too large on small phones
d = d.replace(
    '<svg width="120" height="120" viewBox="0 0 120 120"',
    '<svg width="100" height="100" viewBox="0 0 120 120"'
)
d = d.replace(
    "fontSize: '42px', fontWeight: 900",
    "fontSize: 'clamp(28px, 8vw, 42px)', fontWeight: 900"
)
d = d.replace(
    "fontSize: '56px', fontWeight: 900",
    "fontSize: 'clamp(36px, 10vw, 56px)', fontWeight: 900"
)
# Fix nav padding on mobile
d = d.replace(
    "padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px'",
    "padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px'"
)
# Fix main container padding
d = d.replace(
    "padding: '20px 16px'",
    "padding: '16px 12px'"
)

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Dashboard fixed")

# Fix login page
with open(r'C:\Users\mrhen\trimtrack\app\login\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()
d = d.replace(
    'maxWidth: "420px", width: "100%"',
    'maxWidth: "420px", width: "100%", boxSizing: "border-box"'
)
d = d.replace('padding: "24px"', 'padding: "16px"')
with open(r'C:\Users\mrhen\trimtrack\app\login\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Login fixed")

# Fix trial page
with open(r'C:\Users\mrhen\trimtrack\app\trial\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()
d = d.replace(
    'maxWidth: "420px", width: "100%"',
    'maxWidth: "420px", width: "100%", boxSizing: "border-box"'
)
d = d.replace('padding: "24px"', 'padding: "16px"')
with open(r'C:\Users\mrhen\trimtrack\app\trial\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Trial fixed")

# Fix profile page
with open(r'C:\Users\mrhen\trimtrack\app\profile\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()
d = d.replace(
    '"maxWidth: "540px", margin: "0 auto", padding: "32px 16px"',
    'maxWidth: "540px", margin: "0 auto", padding: "20px 12px"'
)
d = d.replace(
    'padding: "32px 16px"',
    'padding: "20px 12px"'
)
# Make gender buttons wrap on mobile
d = d.replace(
    'padding: "10px 18px", borderRadius: "10px"',
    'padding: "10px 12px", borderRadius: "10px", flex: "1"'
)
with open(r'C:\Users\mrhen\trimtrack\app\profile\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Profile fixed")