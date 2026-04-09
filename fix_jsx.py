with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Move step 4 inside AnimatePresence
content = content.replace(
    "        </AnimatePresence>\n          {step === 4 &&",
    "          {step === 4 &&"
)

# Find where step 4 block ends and add closing AnimatePresence after it
# The step 4 block ends with )}\n        </AnimatePresence> should be added after the step 4 closing
lines = content.split('\n')
new_lines = []
i = 0
step4_closed = False
while i < len(lines):
    line = lines[i]
    new_lines.append(line)
    # After the step 4 closing )}, add </AnimatePresence>
    if not step4_closed and '          )}' in line and i > 0:
        # Check if next non-empty line starts the nav buttons
        j = i + 1
        while j < len(lines) and lines[j].strip() == '':
            j += 1
        if j < len(lines) and ('step > 0' in lines[j] or 'justify-between' in lines[j] or 'flex justify' in lines[j]):
            new_lines.append('        </AnimatePresence>')
            step4_closed = True
    i += 1

with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))
print('Done')