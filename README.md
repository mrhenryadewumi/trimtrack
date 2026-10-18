# TrimTrack

Personalised calorie tracking built for West African food — photo logging, a coach that has read your diary, and a small community feed.

Live: [www.trimtrack.fit](https://www.trimtrack.fit)

## What it does

- **Photo meal scanning**: a photo goes to Claude (vision) with a prompt tuned for West African plates (jollof vs egusi vs moin moin), with GPT-4o as fallback. The estimate is cross-checked against a built-in Nigerian food catalog, then Open Food Facts, then USDA FoodData Central.
- **Calorie goal**: BMR / TDEE from a 4-step onboarding, with a weeks-to-goal projection.
- **AI coach**: a chat that reads the member's diary for the day before answering.
- **Daily statements and trends**: each logged meal rebuilds that day's statement, including back-dated meals.
- **Circle**: a small community feed with cheers, replies, reporting and blocking.
- **Installable**: PWA with push reminders; the Play Store build wraps it, and a separate React Native app uses the same API.

## Engineering notes

- Session ids and confirmation tokens come from `crypto.randomBytes` (they were `Math.random`, which is predictable).
- Login is rate limited per email and per IP, and gives the same answer for unknown email and wrong password, so it cannot be used to find accounts.
- Server-to-server push requires a secret on every path, and notification links can only open TrimTrack.
- Write routes check the session belongs to a real account; 500 errors return a generic message and log the detail server-side.
- `npm test` source guards and a TypeScript check run in GitHub Actions on every push.

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

Fill `.env.local` with Supabase and Resend keys. Stripe keys are unused while payments are off. Run `supabase-schema.sql`, then the files in `sql/` in date order, in the Supabase SQL editor.

## v1 for testers

- Web: create a free account at `/trial`. Login at `/login`. Free while we test. No card.
- Installed app: the PWA (`manifest.json` + `sw.js`) is what the Play Store wrapper loads. Camera scanning needs the site permission — do not block `camera=(self)` in middleware.
- Native `/signup` deep links redirect to `/trial` so the mobile route and the website agree.
- Payments are switched off. Checkout will not take money.

## Tests

```bash
npm test          # source guards: no broken JSX, no prices, payments off, food catalog
npm run test:types
npm run test:live # hits www.trimtrack.fit
```

GitHub Actions runs `npm test` and TypeScript on every push, so a homepage crash like the broken arrow fails on GitHub before Vercel tries to build it.

## Current product

- 4-step onboarding with BMR / TDEE calorie goal
- Meal log, photo scan, search, coach, Circle, statements, weight log
- Email confirmation, password reset, account deletion
