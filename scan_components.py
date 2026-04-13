import re, os

files = [
    r'C:\Users\mrhen\trimtrack\components\FoodSearch.tsx',
    r'C:\Users\mrhen\trimtrack\components\PhotoScanner.tsx',
    r'C:\Users\mrhen\trimtrack\components\UpgradeModal.tsx',
    r'C:\Users\mrhen\trimtrack\components\ScanGate.tsx',
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            d = f.read()
        bad = re.findall(r'[\x80-\xff]+', d)
        if bad:
            print(f"\n{filepath}: {len(set(bad))} corrupted sequences")
            for b in list(set(bad))[:3]:
                idx = d.find(b)
                print(f"  {repr(b)} -> Context: {repr(d[idx-20:idx+40])}")
        else:
            print(f"{filepath}: CLEAN")