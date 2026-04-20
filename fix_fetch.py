with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

old = "fetchMeals().then(data => { const arr = Array.isArray(data) ? data : (data?.data || data?.meals || []); setMeals(Array.isArray(arr) ? arr : []); }).catch(() => setMeals([]));"
new = "fetchMeals().then(data => { let arr = []; if (Array.isArray(data)) arr = data; else if (Array.isArray(data?.data)) arr = data.data; else if (Array.isArray(data?.meals)) arr = data.meals; setMeals(arr); }).catch(() => setMeals([]));"

if old in d:
    d = d.replace(old, new)
    print("Fixed fetchMeals")
else:
    # Try to find and show current fetch line
    import re
    m = re.search(r'fetchMeals\(\).+', d)
    if m:
        print("Current line:", repr(m.group()))
    else:
        print("fetchMeals call not found")

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)