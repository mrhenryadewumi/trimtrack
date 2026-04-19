with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace(
    'import { getGreeting, getStatus } from "@/lib/calculations";',
    'import { getGreeting, getCalorieStatus, getStatusMessage } from "@/lib/calculations";'
)

d = d.replace(
    'const status = getStatus(eaten, goal);',
    'const statusType = getCalorieStatus(eaten, goal);\n  const statusMessage = getStatusMessage(statusType, eaten, goal);\n  const status = { type: statusType, message: statusMessage };'
)

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Fixed")