with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    old = f.read()

# Strip BOM if present
if old.startswith('\ufeff'):
    old = old[1:]

# Keep everything up to the JSX return (line 143 approximately)
# Find the exact split point - keep all logic, replace only JSX
split_marker = "  return (\n    <div className=\"min-h-screen bg-[#f6fbf8]\">"
idx = old.find(split_marker)

if idx < 0:
    # Try alternative
    split_marker = "  return (\n    <div className="
    idx = old.rfind("  return (")

print(f"Split point found at index: {idx}")
print(f"Context: {repr(old[idx:idx+80])}")