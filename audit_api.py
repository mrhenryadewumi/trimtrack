with open(r'C:\Users\mrhen\trimtrack\lib\api-client.ts', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('fetchMeals')
print("FETCH MEALS FUNCTION:")
print(repr(d[idx:idx+300]))