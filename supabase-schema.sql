-- TrimTrack live schema (as the app actually uses it).
-- Accounts live in `subscriptions`, keyed by session_id - not Supabase Auth.
-- Safe to run on an existing project: create-if-missing + add-column-if-missing.
-- Do not drop tables. Do not switch to auth.users.

create extension if not exists pgcrypto;

-- Accounts (the user table)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  email text not null,
  name text,
  password_hash text,
  email_confirmed boolean default false,
  confirm_token text,
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  plan text default 'trial',
  status text default 'pending',
  scan_count_today int default 0,
  scan_date date,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table subscriptions add column if not exists password_hash text;
alter table subscriptions add column if not exists email_confirmed boolean default false;
alter table subscriptions add column if not exists confirm_token text;
alter table subscriptions add column if not exists trial_started_at timestamptz;
alter table subscriptions add column if not exists trial_ends_at timestamptz;
alter table subscriptions add column if not exists plan text default 'trial';
alter table subscriptions add column if not exists status text default 'pending';
alter table subscriptions add column if not exists scan_count_today int default 0;
alter table subscriptions add column if not exists scan_date date;
alter table subscriptions add column if not exists stripe_customer_id text;
alter table subscriptions add column if not exists stripe_subscription_id text;
alter table subscriptions add column if not exists name text;
alter table subscriptions add column if not exists created_at timestamptz default now();
alter table subscriptions add column if not exists updated_at timestamptz default now();

create unique index if not exists subscriptions_email_lower_idx
  on subscriptions (lower(email));
create unique index if not exists subscriptions_session_id_idx
  on subscriptions (session_id);
create index if not exists subscriptions_stripe_sub_idx
  on subscriptions (stripe_subscription_id);

-- Profiles (onboarding / goals). Unique on session_id for upsert.
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
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

alter table profiles add column if not exists session_id text;
alter table profiles add column if not exists name text;
alter table profiles add column if not exists age int;
alter table profiles add column if not exists gender text;
alter table profiles add column if not exists country text;
alter table profiles add column if not exists start_weight numeric;
alter table profiles add column if not exists goal_weight numeric;
alter table profiles add column if not exists height numeric;
alter table profiles add column if not exists activity text;
alter table profiles add column if not exists drink text;
alter table profiles add column if not exists avoid_foods text[];
alter table profiles add column if not exists reminders boolean default true;
alter table profiles add column if not exists daily_calorie_goal int;
alter table profiles add column if not exists updated_at timestamptz default now();

create unique index if not exists profiles_session_id_idx on profiles (session_id);

-- Meals
create table if not exists meal_entries (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  date date not null,
  meal_type text,
  food_name text not null,
  kcal int not null default 0,
  protein numeric default 0,
  carbs numeric default 0,
  fat numeric default 0,
  created_at timestamptz default now()
);

alter table meal_entries add column if not exists session_id text;
alter table meal_entries add column if not exists date date;
alter table meal_entries add column if not exists meal_type text;
alter table meal_entries add column if not exists food_name text;
alter table meal_entries add column if not exists kcal int;
alter table meal_entries add column if not exists protein numeric default 0;
alter table meal_entries add column if not exists carbs numeric default 0;
alter table meal_entries add column if not exists fat numeric default 0;

create index if not exists meal_entries_session_date_idx
  on meal_entries (session_id, date);

-- Daily totals (Trends)
create table if not exists food_statements (
  session_id text not null,
  date date not null,
  timezone text default 'UTC',
  total_kcal int default 0,
  total_protein int default 0,
  total_carbs int default 0,
  total_fat int default 0,
  goal_kcal int default 1500,
  meals_count int default 0,
  status text,
  summary text,
  primary key (session_id, date)
);

-- Weight
create table if not exists weight_log (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  date date not null,
  weight numeric not null,
  created_at timestamptz default now(),
  unique (session_id, date)
);

alter table weight_log add column if not exists session_id text;
create unique index if not exists weight_log_session_date_idx
  on weight_log (session_id, date);

-- Waitlist
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Rate limits
create table if not exists rate_limits (
  bucket text not null,
  key text not null,
  window_start timestamptz not null,
  count int not null default 0,
  primary key (bucket, key, window_start)
);

-- Community
create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  author_name text,
  kind text,
  body text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists community_cheers (
  post_id uuid not null references community_posts(id) on delete cascade,
  session_id text not null,
  created_at timestamptz default now(),
  unique (post_id, session_id)
);

create table if not exists community_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts(id) on delete cascade,
  session_id text not null,
  author_name text,
  body text,
  created_at timestamptz default now()
);

create table if not exists blocked_members (
  session_id text not null,
  blocked_session_id text not null,
  created_at timestamptz default now(),
  unique (session_id, blocked_session_id)
);

create table if not exists community_reports (
  post_id uuid not null,
  session_id text not null,
  reason text,
  created_at timestamptz default now(),
  unique (post_id, session_id)
);

-- Push
create table if not exists push_subscriptions (
  session_id text not null,
  endpoint text unique not null,
  subscription jsonb not null,
  created_at timestamptz default now()
);

-- Email reminders (shape is client-supplied; keep email for account delete)
create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  email text,
  created_at timestamptz default now()
);

alter table reminders add column if not exists email text;
