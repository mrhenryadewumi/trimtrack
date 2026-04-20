with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find the toggle button area
import re
idx = d.find('setDarkMode(!darkMode)')
if idx >= 0:
    print("Toggle button found at:", idx)
    print(repr(d[idx-50:idx+300]))
else:
    print("Toggle button NOT found")