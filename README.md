# TrimTrack

Personalised weight loss tracking app — meal planning, real-time calorie tracking, and daily reminders built around food you love.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend (for reminders)
- **Deploy**: Vercel

## Getting started

### 1. Clone and install

```bash
cd trimtrack
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the SQL editor and run everything in `supabase-schema.sql`
3. Copy your project URL and anon key from Settings → API

### 3. Set environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials in `.env.local`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel and it deploys automatically on every push.

Add the environment variables in Vercel → Project → Settings → Environment Variables.

## Project structure

```
app/
  page.tsx              # Landing page
  layout.tsx            # Root layout
  globals.css           # Global styles
  onboarding/
    page.tsx            # 4-step onboarding flow
  dashboard/
    page.tsx            # Main dashboard
  api/
    waitlist/route.ts   # Waitlist API

lib/
  calculations.ts       # BMR, TDEE, calorie maths
  foods.ts              # Food database (50+ items)
  supabase.ts           # Supabase client

types/
  index.ts              # TypeScript types

supabase-schema.sql     # Run this in Supabase SQL editor
```

## Features

- 4-step onboarding (name, weight goals, lifestyle, review)
- Personalised calorie goal using BMR + TDEE calculation
- Meal plans based on country (Nigeria, UK, USA, Ghana + more)
- Meal builder — search 50+ foods, add to breakfast/lunch/snack/dinner
- Real-time calorie bar with colour alerts (green → yellow → red)
- Exercise recommendations matched to activity level
- Weight log with progress toward goal
- Daily reminders (morning meal plan + evening check-in)
- Foods to avoid list — updated daily

## Next features to build

- [ ] User auth (Supabase Auth)
- [ ] Save meals to database
- [ ] Push notifications (Resend or OneSignal)
- [ ] Weekly progress charts (Recharts)
- [ ] Stripe subscription for premium reminders
- [ ] Mobile app (React Native)
