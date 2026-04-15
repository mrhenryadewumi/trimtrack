with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('trial_ends_at')
if idx >= 0:
    print("trial_ends_at found:")
    print(repr(d[idx-50:idx+150]))
else:
    print("trial_ends_at NOT in dashboard")