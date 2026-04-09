import re

with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

replacements = {
    '\u00f0\u009f\u00bd\u00ef\u00b8\u008f': '',
    '\u00c3\u00a2\u00c5\u201c\u201d Morning + evening': 'Yes - Morning + evening',
    '\u00f0\u009f\u009a\u0080 Start tracking now': 'Start tracking now',
    '\u00c3\u00a2\u20ac\u009d': '-',
    '\u00c3\u00a2\u00e2\u20ac\u00a0\u00e2\u20ac\u00a2': '->',
    'Step {step + 1} of {totalSteps} \u00c3\u00a2\u20ac\u201d {steps[step]}': 'Step {step + 1} of {totalSteps} - {steps[step]}',
    'Your personalised plan is ready \u00c3\u00a2\u0153\u201d': 'Your personalised plan is ready',
    'TrimTrack knows Nigerian food.': 'TrimTrack understands your food.',
    "profile.reminders ? '\u00c3\u00a2\u0153\u201d Morning + evening'": "profile.reminders ? 'Yes - Morning + evening'",
}

for old, new in replacements.items():
    d = d.replace(old, new)

with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)

print('Done')