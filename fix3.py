with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'rb') as f:
    raw = f.read()

# Decode as latin-1 to see the raw bytes
text = raw.decode('latin-1')

# Fix all corrupted strings by their latin-1 representation
fixes = {
    'totalSteps\} \xc3\xa2\xc3\xa2\u20ac {steps': 'totalSteps} - {steps',
    'Yes \xc3\xa2\xc3\xa2\u20ac morning + evening': 'Yes - morning + evening',
    'STEP 3 \xc3\xa2\xc3\xa2\u20ac REVIEW': 'STEP 3 - REVIEW',
    'ready \xc3\xa2\xc3\x85\u201c\xc3\xa2\u20ac\u0153': 'ready',
    '\xc3\xa2\xc3\x85\u201c\xc3\xa2\u20ac\u0153 Morning + evening': 'Yes - Morning + evening',
    '\xc3\xb0\xc3\x85\xc2\xb8\xc3\xa2\u20ac\xa6': '',
    '\xc3\xb0\xc3\x85\xc5\x93\xc3\xaf\xc2\xb8': '',
    '\xc3\xa2\xc3\xa2\u20ac <- Back': '<- Back',
    'Continue ->\xc3\xa2\xc3\xa2\u20ac \xc3\xa2\u20ac\u2122': 'Continue ->',
    'See my plan \xc3\xa2\xc3\xa2\u20ac \xc3\xa2\u20ac\u2122': 'See my plan ->',
    '\xc3\xb0\xc3\x85\xc5\xa1 Start tracking now': 'Start tracking now',
    "profile.country || 'Global'} \xc3\xb0\xc3\x85\xc2\xb8\xc3\xaf\xc2\xb8": "profile.country || 'Global'}",
}

import re
# Nuclear option - remove all non-ASCII that isnt valid
def fix_line(line):
    # Replace known corrupted sequences
    line = re.sub(r'[^\x00-\x7E\u00A0-\u00FF]+', '', line)
    return line

lines = text.split('\n')
fixed = []
for line in lines:
    if any(x in line for x in ['\xc3', '\xc2', '\xc5', '\xc4']):
        line = re.sub(r'[\x80-\xff]+', '', line)
        line = line.replace('  ', ' ').replace('} - {', '} - {')
    fixed.append(line)

result = '\n'.join(fixed)

# Manual targeted fixes on clean text
result = result.replace('totalSteps}  {steps', 'totalSteps} - {steps')
result = result.replace('Yes  morning + evening', 'Yes - morning + evening')
result = result.replace('STEP 3  REVIEW', 'STEP 3 - REVIEW')
result = result.replace('ready ', 'ready')
result = result.replace(' Morning + evening', 'Yes - Morning + evening')
result = result.replace('Global} ', 'Global}')
result = result.replace('  morning + evening', ' morning + evening')
result = result.replace('<- Back', '<- Back')
result = result.replace('Continue -> ', 'Continue ->')
result = result.replace('See my plan -> ', 'See my plan ->')
result = result.replace(' Start tracking now', 'Start tracking now')

with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'w', encoding='utf-8') as f:
    f.write(result)
print('Done')