with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

idx = d.find('setReady')
while idx >= 0:
    print(repr(d[idx-50:idx+100]))
    print("---")
    idx = d.find('setReady', idx+1)