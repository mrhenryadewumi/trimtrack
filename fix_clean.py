with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace("profile.reminders ? '\u2713 Morning + evening'", "profile.reminders ? 'Yes - Morning + evening'")
d = d.replace("'\u2713 Morning + evening'", "'Yes - Morning + evening'")
d = d.replace('\U0001f680 Start tracking now', 'Start tracking now')
d = d.replace('\u2713 ', 'Yes ')
d = d.replace(' \u2014 ', ' - ')
d = d.replace('\u2192', '->')
d = d.replace('\u2190', '<-')
d = d.replace('TrimTrack knows Nigerian food.', 'TrimTrack understands your food.')
d = d.replace("'Gym 2\u20133\u00d7 week'", "'Gym 2-3x per week'")
d = d.replace('Gym 2\u20133\u00d7 week', 'Gym 2-3x per week')

with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print('Done')