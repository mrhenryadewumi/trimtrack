import re

files = {
    r'C:\Users\mrhen\trimtrack\components\FoodSearch.tsx': [
        ("food.source === 'local' ? '\U0001f1f3\U0001f1ec' : '\U0001f30d'", "food.source === 'local' ? 'NG' : 'GL'"),
        ('\U0001f1f3\U0001f1ec', 'NG'),
        ('\U0001f30d', 'GL'),
        ('g P \u00b7 ', 'g P - '),
        ('g C \u00b7 ', 'g C - '),
    ],
    r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx': [
        ('kcal left \u00b7', 'kcal left -'),
        (' \u00b7 ', ' - '),
    ],
}

for filepath, replacements in files.items():
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        for old, new in replacements:
            content = content.replace(old, new)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed: {filepath}')
    except Exception as e:
        print(f'Error {filepath}: {e}')