import re

fixes = {
    r'C:\Users\mrhen\trimtrack\components\FoodSearch.tsx': [
        ('â€"', '-'),
        ('Â·', '-'),
        ('Ã—', 'x'),
    ],
    r'C:\Users\mrhen\trimtrack\components\PhotoScanner.tsx': [
        ('\xc3\x97', 'x'),
        ('\xd7', 'x'),
    ],
    r'C:\Users\mrhen\trimtrack\components\UpgradeModal.tsx': [
        ('\xc2\xa3', 'GBP'),
        ('\xa3', 'GBP'),
    ],
}

for filepath, replacements in fixes.items():
    with open(filepath, 'rb') as f:
        raw = f.read()
    
    # Decode as utf-8 with replacement
    text = raw.decode('utf-8', errors='replace')
    
    for old, new in replacements:
        text = text.replace(old, new)
    
    # Nuclear - remove any remaining non-ASCII except GBP
    text = re.sub(r'[\x80-\xff]', '', text)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Fixed: {filepath.split(chr(92))[-1]}")

print("All done")