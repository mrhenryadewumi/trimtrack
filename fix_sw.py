with open(r'C:\Users\mrhen\trimtrack\public\sw.js', 'r', encoding='utf-8') as f:
    d = f.read()

old = """const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/onboarding',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]"""

new = """const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/onboarding',
  '/login',
  '/profile',
  '/statements',
  '/trial',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]"""

if old in d:
    d = d.replace(old, new)
    print("SW updated")
else:
    print("Pattern not found")

# Bump cache version to force update
d = d.replace("trimtrack-v1", "trimtrack-v2")

with open(r'C:\Users\mrhen\trimtrack\public\sw.js', 'w', encoding='utf-8') as f:
    f.write(d)