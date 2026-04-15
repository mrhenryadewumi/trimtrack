# Fix 2 - calculations.ts: fix status messages - no shaming copy
with open(r'C:\Users\mrhen\trimtrack\lib\calculations.ts', 'r', encoding='utf-8') as f:
    d = f.read()

# Find and replace the full getStatusMessage function
import re
old_func = re.search(r"getStatusMessage\(status: CalorieStatus, eaten: number, goal: number\): string \{.*?\n\}", d, re.DOTALL)
if old_func:
    old = old_func.group()
    new = """getStatusMessage(status: CalorieStatus, eaten: number, goal: number): string {
  const remain = goal - eaten
  switch (status) {
    case 'empty':    return "You're off to a fresh start today. Add your first meal."
    case 'good':     return `You're on track. ${remain.toLocaleString()} kcal remaining today.`
    case 'warn':     return `Getting close - ${remain.toLocaleString()} kcal left. Make your next meal count.`
    case 'critical': return `Only ${remain.toLocaleString()} kcal left today. Stick to light options.`
    case 'over':     return `You're ${Math.abs(remain).toLocaleString()} kcal over your target today. That's okay - aim for balance across the week.`
    default:         return "Keep logging your meals to stay on track."
  }
}"""
    d = d.replace(old, new)
    print("Status messages fixed")
else:
    print("Status message function not found")
    idx = d.find("getStatusMessage")
    print(repr(d[idx:idx+500]))

with open(r'C:\Users\mrhen\trimtrack\lib\calculations.ts', 'w', encoding='utf-8') as f:
    f.write(d)