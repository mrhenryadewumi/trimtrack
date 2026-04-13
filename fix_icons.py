import re

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Remove all mojibake sequences
d = re.sub(r'[Ã][^\s]{1,6}', '', d)
d = re.sub(r'[\x80-\xff]+', '', d)

# Fix common corrupted icons - replace with clean text equivalents
d = d.replace('Ã¢Ã¢Ã¢', 'x')
d = d.replace('ÃƒÂ¢ÃƒÂ¢ÃƒÂ¢', 'x')

with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")