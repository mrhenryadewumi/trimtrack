-- Run this in your Supabase SQL editor

-- Waitlist
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- User profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  name text,
  age int,
  gender text,
  country text,
  start_weight numeric,
  goal_weight numeric,
  height numeric,
  activity text,
  drink text,
  avoid_foods text[],
  reminders boolean default true,
  daily_calorie_goal int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Meal entries
create table if not exists meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  date date not null,
  meal_type text not null,
  food_name text not null,
  kcal int not null,
  protein numeric default 0,
  carbs numeric default 0,
  fat numeric default 0,
  created_at timestamptz default now()
);

-- Weight log
create table if not exists weight_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  date date not null,
  weight numeric not null,
  created_at timestamptz default now()
);

-- Row level security
alter table profiles enable row level security;
alter table meal_entries enable row level security;
alter table weight_log enable row level security;

create policy "Users can manage own profile" on profiles
  for all using (auth.uid() = user_id);

create policy "Users can manage own meals" on meal_entries
  for all using (auth.uid() = user_id);

create policy "Users can manage own weight" on weight_log
  for all using (auth.uid() = user_id);
