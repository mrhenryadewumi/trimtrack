-- TrimTrack social layer: posts, replies, cheers
-- Run in Supabase SQL editor or: supabase db push (as migration 001_social_layer.sql)

create type post_kind as enum ('journey', 'idea', 'recipe', 'question');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind post_kind not null default 'journey',
  body text not null check (char_length(body) between 1 and 2000),
  -- kind-specific payload:
  --   journey: {"day": 90, "start_kg": 86, "now_kg": 79}
  --   recipe:  {"food": "Egusi Soup", "kcal": 340, "delta_kcal": -120, "emoji": "🍲"}
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table public.cheers (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)          -- one cheer per user per post; delete row to un-cheer
);

create index posts_kind_created_idx on public.posts (kind, created_at desc);
create index replies_post_idx on public.replies (post_id, created_at);

-- Row Level Security
alter table public.posts   enable row level security;
alter table public.replies enable row level security;
alter table public.cheers  enable row level security;

-- Everyone signed-in can read the community; authors own their rows.
create policy "read posts"    on public.posts   for select using (auth.role() = 'authenticated');
create policy "insert posts"  on public.posts   for insert with check (auth.uid() = user_id);
create policy "delete own"    on public.posts   for delete using (auth.uid() = user_id);

create policy "read replies"   on public.replies for select using (auth.role() = 'authenticated');
create policy "insert replies" on public.replies for insert with check (auth.uid() = user_id);
create policy "delete own reply" on public.replies for delete using (auth.uid() = user_id);

create policy "read cheers"   on public.cheers  for select using (auth.role() = 'authenticated');
create policy "cheer"         on public.cheers  for insert with check (auth.uid() = user_id);
create policy "uncheer"       on public.cheers  for delete using (auth.uid() = user_id);

-- Feed helper: posts with author name, cheer/reply counts, and whether I cheered
create or replace view public.feed as
  select p.*,
         (select count(*) from public.replies r where r.post_id = p.id) as reply_count,
         (select count(*) from public.cheers c where c.post_id = p.id)  as cheer_count,
         exists(select 1 from public.cheers c where c.post_id = p.id and c.user_id = auth.uid()) as cheered
  from public.posts p;
