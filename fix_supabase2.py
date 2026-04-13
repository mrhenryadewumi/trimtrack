with open(r'C:\Users\mrhen\trimtrack\lib\supabase.ts', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace("remove(name, options) {", "remove(name: string, options: any) {")

with open(r'C:\Users\mrhen\trimtrack\lib\supabase.ts', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")