# TrimTrack

Personalised calorie tracking built for West African food — photo logging, a coach that has read your diary, and a small community feed.

Live: [www.trimtrack.fit](https://www.trimtrack.fit)

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + app palette (`#0a1310` / `#b5f23d`)
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Payments**: switched off while we test
- **Deploy**: Vercel

## Getting started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Fill `.env.local` with Supabase and Resend keys. Stripe keys are unused while payments are off. Run `supabase-schema.sql` plus later SQL from commits (subscriptions, community, rate_limits, blocked_members, community_reports) in the Supabase SQL editor.

## v1 for testers

- Web: create a free account at `/trial`. Login at `/login`. Free while we test. No card.
- Installed app: the PWA (`manifest.json` + `sw.js`) is what the Play Store wrapper loads. Camera scanning needs the site permission — do not block `camera=(self)` in middleware.
- Native `/signup` deep links redirect to `/trial` so the mobile route and the website agree.
- Payments are switched off. Checkout will not take money.

## Current product

- 4-step onboarding with BMR / TDEE calorie goal
- Meal log, photo scan, search, coach, Circle, statements, weight log
- Email confirmation, password reset, account deletion
