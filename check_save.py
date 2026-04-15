with open(r'C:\Users\mrhen\trimtrack\lib\api-client.ts', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('saveMeal')
print("saveMeal:")
print(repr(d[idx:idx+300]))