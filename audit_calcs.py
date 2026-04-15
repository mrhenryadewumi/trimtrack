with open(r'C:\Users\mrhen\trimtrack\lib\calculations.ts', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('getGreeting')
print("GREETING FUNCTION:")
print(repr(d[idx:idx+300]))
print()

idx2 = d.find('getStatusMessage')
print("STATUS MESSAGE FUNCTION:")
print(repr(d[idx2:idx2+400]))