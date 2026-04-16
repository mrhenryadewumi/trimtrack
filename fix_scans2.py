with open(r'C:\Users\mrhen\trimtrack\app\api\subscription\route.ts', 'r', encoding='utf-8') as f:
    d = f.read()

d = d.replace('const FREE_SCANS_PER_DAY = 3;', 'const FREE_SCANS_PER_DAY = 6;')

# Also remove broken createServerClient dependency
d = d.replace(
    "import { createServerClient } from '@/lib/supabase'\n",
    "import { createClient } from '@supabase/supabase-js';\n"
)

# Replace supabase client creation
d = d.replace(
    "  const supabase = createServerClient()\n  if (!supabase) return new Response(\"Build skip\", { status: 200 })",
    "  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)"
)

with open(r'C:\Users\mrhen\trimtrack\app\api\subscription\route.ts', 'w', encoding='utf-8') as f:
    f.write(d)
print("Done")