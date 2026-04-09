import subprocess
result = subprocess.run(
    ['git', 'show', '94a31f7:app/onboarding/page.tsx'],
    capture_output=True,
    cwd=r'C:\Users\mrhen\trimtrack'
)
content = result.stdout.decode('utf-8', errors='replace')
with open(r'C:\Users\mrhen\trimtrack\app\onboarding\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done - lines:', len(content.split('\n')))