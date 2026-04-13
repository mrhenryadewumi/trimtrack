import re, os

root = r'C:\Users\mrhen\trimtrack'
check_dirs = ['app', 'components', 'lib']
bad_files = []

for check_dir in check_dirs:
    dirpath = os.path.join(root, check_dir)
    for dirpath2, dirs, files in os.walk(dirpath):
        for fname in files:
            if fname.endswith(('.tsx', '.ts')):
                fpath = os.path.join(dirpath2, fname)
                try:
                    with open(fpath, 'r', encoding='utf-8') as f:
                        d = f.read()
                    bad = re.findall(r'[\x80-\xff]+', d)
                    if bad:
                        bad_files.append((fpath, len(set(bad))))
                except:
                    pass

if bad_files:
    print(f"Files with corruption ({len(bad_files)}):")
    for f, n in bad_files:
        print(f"  {f.replace(root, '')} - {n} sequences")
else:
    print("ALL FILES CLEAN")