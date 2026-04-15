# Fix api-client.ts deleteMeal function
with open(r'C:\Users\mrhen\trimtrack\lib\api-client.ts', 'r', encoding='utf-8') as f:
    d = f.read()

print("Current deleteMeal:")
idx = d.find('deleteMeal')
print(repr(d[idx:idx+200]))