with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Check brace balance
opens = d.count('{')
closes = d.count('}')
print(f"Open braces: {opens}")
print(f"Close braces: {closes}")
print(f"Difference: {opens - closes}")

# Check for common issues
if "fetch('/api/profile'" in d:
    print("Profile fetch: OK")
if "setProfile" in d:
    print("setProfile: OK")
    
# Find the useEffect block
idx = d.find("trimtrack_profile")
print("\nProfile loading section:")
print(repr(d[idx-50:idx+500]))