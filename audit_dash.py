with open(r'C:\Users\mrhen\trimtrack\app\dashboard\page.tsx', 'r', encoding='utf-8') as f:
    d = f.read()

# Find calculations section
idx = d.find('const eaten')
print("CALCULATIONS:")
print(repr(d[idx:idx+400]))
print()

# Find meal fetching
idx2 = d.find('fetchMeals')
print("FETCH MEALS:")
print(repr(d[idx2:idx2+300]))
print()

# Find getGreeting usage
idx3 = d.find('getGreeting')
print("GREETING:")
print(repr(d[idx3:idx3+100]))
print()

# Find getStatusMessage
idx4 = d.find('getStatusMessage')
print("STATUS MESSAGE:")
print(repr(d[idx4:idx4+100]))