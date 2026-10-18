-- Run once in the Supabase SQL editor (project: trimtrack).
--
-- Every server route uses the service role key, which bypasses row-level
-- security. These policies only ever applied to the PUBLIC anon key, and the
-- three on `subscriptions` let anyone holding that key read and write every
-- account row: emails, password hashes and session ids (the login credential).
--
-- After this, the anon key can read nothing except daily_motivations.
-- The web app and the native app keep working: both go through /api routes.

drop policy if exists "Allow all for service role" on public.subscriptions;
drop policy if exists "subscriptions_own_email"    on public.subscriptions;
drop policy if exists "subscriptions_service_only" on public.subscriptions;
drop policy if exists "Allow insert for all"       on public.waitlist;
drop policy if exists "Allow read own"             on public.waitlist;
drop policy if exists "users_own_statements"       on public.food_statements;
drop policy if exists "meal_entries_own"           on public.meal_entries;
drop policy if exists "profiles_own"               on public.profiles;
drop policy if exists "weight_log_own"             on public.weight_log;

-- Check: should return 0
-- begin; set local role anon; select count(*) from subscriptions; rollback;
