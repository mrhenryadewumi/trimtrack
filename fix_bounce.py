with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Stop redirect loop - only redirect if truly no data
d = d.replace(
    "      .catch(() => { if (!saved) router.push('/login') })",
    "      .catch((e) => { console.error('Profile fetch error:', e) })"
)
d = d.replace(
    "        } else if (!saved) {\n          // No local data and no session - redirect to login not onboarding\n          router.push('/login')\n        }",
    "        } else if (!saved) {\n          router.push('/login')\n        }"
)

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")