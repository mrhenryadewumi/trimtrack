with open(r'C:\Users\mrhen\trimtrack\lib\supabase.ts', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace("get(name) {", "get(name: string) {")
d = d.replace("set(name, value, options) {", "set(name: string, value: string, options: any) {")
d = d.replace("delete(name) {", "delete(name: string) {")

with open(r'C:\Users\mrhen\trimtrack\lib\supabase.ts', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")