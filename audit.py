content = open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'r', encoding='utf-8', errors='ignore').read()

# Write a clean version to a temp file for inspection
lines = content.split('\n')
clean = []
for line in lines:
    # Keep the line but mark corrupted ones
    if any(x in line for x in ['Ã', 'â€', 'Å"', 'Æ']):
        clean.append('// CORRUPTED: ' + line)
    else:
        clean.append(line)

with open(r'C:\Users\mrhen\trimtrack\onboarding_audit.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(clean))
print('Audit done - check onboarding_audit.txt')