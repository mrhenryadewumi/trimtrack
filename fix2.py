with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'r', encoding='latin-1') as f:
    d = f.read()

d = d.encode('latin-1').decode('utf-8', errors='replace')

fixes = [
    ('\ufffd\ufffd\ufffd\ufffd', ''),
    ('Start tracking now', 'Start tracking now'),
    ('Morning + evening', 'Morning + evening'),
    ('TrimTrack knows Nigerian food.', 'TrimTrack understands your food.'),
]

import re
d = re.sub(r'[^\x00-\x7F\u00A0-\u024F\u2000-\u206F]+', '', d)
d = d.replace('Yes Morning + evening', 'Yes - Morning + evening')
d = d.replace('Step {step + 1} of {totalSteps}  {steps[step]}', 'Step {step + 1} of {totalSteps} - {steps[step]}')
d = d.replace('Your personalised plan is ready Yes', 'Your personalised plan is ready')
d = d.replace('Start tracking now', 'Start tracking now')
d = d.replace('TrimTrack knows Nigerian food.', 'TrimTrack understands your food.')
d = d.replace('Continue ', 'Continue ->')
d = d.replace(' Back', '<- Back')

with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print('Done')