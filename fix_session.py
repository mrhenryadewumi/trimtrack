with open(r'C:\Users\mrhen\trimtrack\app\api\auth\login\route.ts', 'r', encoding='utf-8') as f:
    d = f.read()

# Keep 30 days - this is correct for a good UX
# But add a last_active timestamp so we can track idle timeout later
d = d.replace(
    "maxAge: 60 * 60 * 24 * 30,",
    "maxAge: 60 * 60 * 24 * 30, // 30 days - renewed on activity"
)

with open(r'C:\Users\mrhen\trimtrack\app\api\auth\login\route.ts', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")