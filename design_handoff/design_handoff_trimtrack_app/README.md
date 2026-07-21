# Handoff: TrimTrack App Redesign (Dashboard, Social, AI Coach)

## Overview
A full redesign of the TrimTrack calorie-tracking app (Next.js + Tailwind + Supabase, repo `mrhenryadewumi/trimtrack`): refined dark dashboard, a social/community layer (feed, journeys, threads), an AI coach chat, plus scan/search/goals flows, onboarding, and a Pro paywall. Mobile-first (390×844), with a dark and light theme.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive prototypes showing intended look and behavior, NOT production code. Recreate these designs inside the existing TrimTrack codebase (Next.js App Router, Tailwind, Supabase) using its established patterns. Do not ship these HTML files.

- `TrimTrack Final.dc.html` — source prototype (open in the design tool)
- `TrimTrack Standalone.html` — self-contained copy; open in any browser to click through every flow
- `screens/*.png` — one PNG per screen

## Fidelity
**High-fidelity.** Colors, type, spacing, radii and copy are final unless noted. Prices on the paywall (₦1,600/mo yearly, ₦2,500/mo monthly) are placeholders.

## Design Tokens
Dark theme (default):
- bg `#0a1310` · card `#162a20` · deep/inset `#0e1e16` · sheet `#132218`
- ink `#ffffff` · body text `#c9d8ce` · muted `#8a9a92` · faint `#5f7269`
- hairline `rgba(255,255,255,.05)` (also .08/.13/.25 steps) · track `rgba(255,255,255,.07)`
- accent (lime) `#b5f23d` · accent bg `rgba(181,242,61,.12)` · accent line `rgba(181,242,61,.2)`
- hero gradient `linear-gradient(150deg,#173026,#0e1e16)` · nav `rgba(10,19,16,.92)` + blur(20px)
- chart bar `#233020`; macro colors: protein `#5e9bff`, carbs `#f5c542`, fat `#ff8a5e`

Light theme: bg `#f4f7f2`, card `#fff`, ink `#0f1f14`, accent becomes forest `#1a5c38`, accent bg `rgba(26,92,56,.1)`, hairlines `rgba(15,31,20,.08–.3)`. Lime `#b5f23d` stays for filled buttons/FAB (always with dark `#0a1310` text). Brand forest gradient `linear-gradient(135deg,#1a5c38,#0f3d25)` is used for user avatars in both themes (lime initials).

Typography: **Plus Jakarta Sans** (400–800) for UI; **Space Grotesk** (500–700) for all numerals/stats. Radii: cards 16–28px, chips/buttons 999px, list rows 15–18px. Nav bar 78px, blur + hairline top border. Min hit target 44px.

## Screens / Views
1. **Home** (`screens/home.png`) — Header (brand label 11px/800/18% tracking, greeting 20px/800, streak chip 🔥, avatar 38px). Circle avatars row (50px, 2.5px lime ring = active today, dashed = invite). Hero card: SVG ring 112px (stroke 10, dasharray 308, offset = eaten fraction; lime on dark track) with kcal-left center (31px Space Grotesk); right column: eaten/goal, "83% · on track" chip, steps + earned-back line. 3-col macro grid (value + 4px progress bar). Lime "Ask Trim anything" row card (36px dark avocado circle, title 13px/800 `#0a1310`, sub 11px `#2d4a35`, → arrow). Social cheer strip (Adaeze logged…, 👏 count pill). Meals list (dot, name 13px/600, meta 10px, kcal in Space Grotesk lime); dashed "Dinner — N kcal left" row opens Scan.
2. **Community feed** (`screens/community-feed.png`) — Tab pills (Journeys/Ideas/Recipes/Q&A; active = lime bg + dark text). Journey card: avatar, name + "Day 90" chip, Day 1 → Day 90 weight tiles (highlight tile lime-tinted), quote, 👏/💬 pills, Read →. Ideas: tip cards with 💡 chip. Recipes: row cards with emoji tile + "Log it". Q&A: question cards with answer counts. Floating "✍️ Share your journey" pill (bottom 118px, right 18px) opens composer modal (dark sheet card, textarea, Cancel/Post) — posting prepends a "You" card.
3. **Post thread** (`screens/post-thread.png`) — Back header, post card, threaded replies (32px avatars, bubble radius 4/16/16/16, indent 26px for author replies, "author" chip), reply composer bar pinned bottom; sending appends lime-tinted bubble and auto-scrolls.
4. **AI coach** (`screens/ai-coach.png`) — Chat: pinned header (avocado avatar, "Trim, your coach", "ask me anything" status), coach bubbles = card bg, user bubbles = lime with dark text, starter-question chips (outline lime), typing indicator (●●● pulsing), input bar pinned bottom. **Behavior:** replies come from Claude (haiku) with a system prompt embedding live user context (budget, eaten, macros, steps, weight, streak, today's meals; 1–3 sentences, Nigerian-food-aware); falls back to keyword-scripted replies offline. In production: server route calling the Messages API with the user's daily snapshot.
5. **Scan** (`screens/scan.png`) — Full-dark camera mock: dashed lime viewfinder 262px, "DETECTED · 92% MATCH" chip, result card (name, macros meta, kcal 22px lime) with Adjust / Log meal (lime) buttons.
6. **Log sheet** (`screens/log-sheet.png`) — Bottom sheet from nav "+": grab handle, "Log a meal", 3 rows: Scan a meal / Search food / Quick add.
7. **Search** (`screens/search.png`) — Pill search input, live-filtered rows (emoji tile 42px, name, detail, kcal, round +/✓ toggle 34px), empty state links to Scan.
8. **Trends** (`screens/trends.png`) — 7-day intake bar chart (bars `#233020`, today lime, 96px tall), Weight card (34px numeral, −0.6 chip, 44% progress to goal), Streak/Days-logged tile pair.
9. **Profile (You)** (`screens/profile.png`) — Centered avatar 74px + lime ring, stat tiles (-4.0 kg / streak / 92%), badge row (earned lime-bordered, locked 45% opacity), settings rows: Goals & targets → Goals screen, Units, Notifications, **Upgrade to Pro** (forest gradient row, PRO chip) → Paywall, Sign out → Onboarding.
10. **Goals** (`screens/goals.png`) — Stepper cards: calorie budget (±50, 1200–4000) and goal weight (±0.5 kg) — 44px round − / + buttons; macro split bar (25/50/25); Save. **Calorie budget feeds Home** (kcal-left recomputes).
11. **Paywall** (`screens/paywall.png`) — ✕ close, lime ⚡ tile 64px, "TrimTrack Pro", 4 feature rows (✓ chips), plan cards yearly (SAVE 36% badge) / monthly with selected state (2px lime border + tint), lime CTA "Start 7-day free trial", restore link.
12. **Onboarding ×3** (`screens/onboarding-*.png`) — Progress dashes; (1) ring logo + "Lose weight without losing your culture" 28px/800 + Get started; (2) goal picker cards (selected = 2px lime border + tint); (3) plan summary: 1,500 kcal (46px lime numeral), protein/steps/pace tiles, Start tracking → Home.

## Interactions & Behavior
- Bottom nav: Home / Community / + (52px lime FAB, raised 24px) / Trends / You; active = lime + 800 weight. Nav hidden on thread, coach, scan, search, goals, paywall, onboarding.
- Cheers toggle (+1/−1, tinted bg when cheered) and persist across screens. Feed card cheer stops propagation (doesn't open thread).
- All screens scroll internally with hidden scrollbars; screens mount with fadeUp .3s; hero ring draws in 1.1s ease-out (dashoffset animation); macro bars scaleX-in staggered .7s (origin left); sheet slides up .28s; modal pops in .22s; typing dots pulse 1s loop.
- Theme switch swaps the token set only (no layout change).

## State Management
`screen` (home|feed|thread|coach|scan|search|goals|trends|you|paywall|onboard), `feedTab`, cheer counts/toggled flags, `myReplies`, `myPosts`, composer + coach drafts, `coachMsgs` + `coachTyping`, `searchQ` + `added{}`, `calGoal` (drives kcal-left everywhere), `weightGoal`, `plan`, `obStep`/`obGoal`, `theme` (dark|light), `userName`, `showCircle`.
Suggested Supabase tables for the social layer: `posts(id,user_id,kind[journey|idea|recipe|question],body,meta jsonb,created_at)`, `replies(id,post_id,user_id,body)`, `cheers(post_id,user_id)` unique pair, plus existing meals/steps/goals.

## Assets
No image assets — emoji used as placeholder food/badge icons (matches current app's emoji usage); Google Fonts: Plus Jakarta Sans, Space Grotesk.

## Files
- `TrimTrack Final.dc.html` (source), `TrimTrack Standalone.html` (click-through), `screens/` (14 PNGs)
