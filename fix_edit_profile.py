with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace("router.push('/onboarding')", "router.push('/profile')")
d = d.replace('router.push("/onboarding")', 'router.push("/profile")')

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")