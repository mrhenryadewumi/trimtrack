with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = """    // Schedule midnight reset
    const now = new Date()
    const midnight = new Date(now)"""

new = """    // Schedule midnight reset
    const midnightNow = new Date()
    const midnight = new Date(midnightNow)"""

old2 = "    const msToMidnight = midnight.getTime() - now.getTime()"
new2 = "    const msToMidnight = midnight.getTime() - midnightNow.getTime()"

if old in d:
    d = d.replace(old, new)
    d = d.replace(old2, new2)
    print("FIXED")
else:
    print("NOT FOUND")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)