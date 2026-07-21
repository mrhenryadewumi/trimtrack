# Implementation Guide — TrimTrack Redesign

Build order: 7 small PRs, each shippable. Files in this folder are drop-ins;
paths like `app/api/coach/route.ts` show where they go in the repo.
Design specs live in `../README.md`; click-through reference: `../TrimTrack Standalone.html`.

## PR 1 — Design tokens (½ day)
1. Merge `tailwind.tokens.ts` into `tailwind.config.ts` `theme.extend` (your green/lime scales already match — keep them).
2. Add the `:root/html.light` CSS vars from that file to `app/globals.css`; add Space Grotesk to your font loading (next/font) as `font-num`.
3. Theme = `dark`/`light` class on `<html>`; persist choice in the profile or localStorage.

**Claude Code prompt:** "Read design_handoff/implementation/tailwind.tokens.ts and merge it into our tailwind config + globals.css. Add Space Grotesk via next/font. Don't restyle any screens yet."

## PR 2 — Home dashboard (1-2 days)
Rebuild `app/dashboard/page.tsx` per README §Home: hero ring (SVG, dasharray 308), macro grid, "Ask Trim anything" card, cheer strip (static for now), meals list, bottom nav. All data comes from your existing hooks/queries — this is a re-skin. Use framer-motion for the ring draw-in and staggered macro bars (specs: 1.1s ease-out; .7s with .08s stagger).

**Prompt:** "Read design_handoff/README.md §Home and screens/home.png. Rebuild the dashboard page to match, using our existing data fetching and the new tokens. framer-motion for entrance animations."

## PR 3 — Trends, You, Goals (1 day)
Re-skin per README §8-10. Trends chart: recharts BarChart, bars `#233020`, today `lime-400`, radius 6. Goals steppers write to your existing profile/goal columns — home reads the same source so kcal-left updates automatically.

## PR 4 — Scan & Search re-skin (1 day)
Keep your scanner + food-search logic; apply §5-7 styling (viewfinder frame, result card, pill input, +/✓ row buttons, bottom "Log a meal" sheet replacing the current add flow).

## PR 5 — Social layer (2-3 days)
1. Run `supabase/001_social_layer.sql` (tables + RLS + `feed` view).
2. Community tab: query `feed` ordered by `created_at desc`, filter by `kind` for the tab pills.
3. Cheer = insert/delete on `cheers` (optimistic UI; unique PK makes it idempotent).
4. Thread view: post + `replies`; composer inserts a row.
5. "Share your journey" modal → insert into `posts` with kind `journey` and meta `{day, start_kg, now_kg}` computed from the profile.

**Prompt:** "Read design_handoff/implementation/supabase/001_social_layer.sql (already applied) and README §2-3. Build the Community tab: feed with kind filter pills, cheer toggle, thread view with replies, share-journey modal."

## PR 6 — AI coach (1 day)
1. Copy `app-api-coach-route.ts` → `app/api/coach/route.ts`; adjust the three queries to your actual table/column names; set `ANTHROPIC_API_KEY` in env.
2. Coach screen per README §4: message list, typing indicator, starter chips; POST to `/api/coach` with the last 8 turns as history.
3. Free-tier gate: N questions/day, then 402 → paywall.

## PR 7 — Onboarding + paywall (1 day)
Restyle your existing onboarding/upgrade flows per README §11-12. Paywall CTA hits your current Stripe checkout; plan cards are UI-only state until checkout.

## QA checklist
- Compare every screen to `screens/*.png` side by side (both themes)
- kcal-left updates after goals change; cheer state survives navigation
- Coach: replies grounded in real data; graceful 402/502 states
- Hit targets ≥44px; scrollbars hidden on inner scroll areas
