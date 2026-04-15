import type { UserProfile, Activity, CalorieStatus, DailyPlan, ExerciseItem } from '@/types'

// ── CALORIE MATHS ──────────────────────────────────────────────
export function calcBMR(profile: UserProfile): number {
  const { startWeight, height, age, gender } = profile
  if (gender === 'male') {
    return Math.round(10 * startWeight + 6.25 * height - 5 * age + 5)
  }
  return Math.round(10 * startWeight + 6.25 * height - 5 * age - 161)
}

export function calcTDEE(profile: UserProfile): number {
  const multipliers: Record<Activity, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  }
  return Math.round(calcBMR(profile) * multipliers[profile.activity])
}

export function calcDailyGoal(profile: UserProfile): number {
  const tdee = calcTDEE(profile)
  const diff = profile.startWeight - profile.goalWeight
  const deficit = diff > 20 ? 700 : 500
  return Math.max(1200, tdee - deficit)
}

export function calcWeeksToGoal(profile: UserProfile): number {
  const diff = Math.max(0, profile.startWeight - profile.goalWeight)
  return Math.ceil(diff / 0.75)
}

export function calcBMI(profile: UserProfile): number {
  const heightM = profile.startWeight / 100
  return Math.round((profile.startWeight / (heightM * heightM)) * 10) / 10
}

// ── CALORIE STATUS ─────────────────────────────────────────────
export function getCalorieStatus(eaten: number, goal: number): CalorieStatus {
  if (eaten === 0) return 'empty'
  const pct = eaten / goal
  if (pct <= 0.6) return 'good'
  if (pct <= 0.85) return 'warn'
  if (pct <= 1.0) return 'critical'
  return 'over'
}

export function getStatusColour(status: CalorieStatus): string {
  const map: Record<CalorieStatus, string> = {
    empty:    '#d1d5db',
    good:     '#16a34a',
    warn:     '#d97706',
    critical: '#ef4444',
    over:     '#dc2626',
  }
  return map[status]
}

export function getStatusMessage(status: CalorieStatus, eaten: number, goal: number): string {
  const remain = goal - eaten
  switch (status) {
    case 'empty':    return "You're off to a fresh start today. Add your first meal."
    case 'good':     return `You're on track. ${remain.toLocaleString()} kcal remaining today.`
    case 'warn':     return `Getting close - ${remain.toLocaleString()} kcal left. Make your next meal count.`
    case 'critical': return `Only ${remain.toLocaleString()} kcal left today. Stick to light options.`
    case 'over':     return `You're ${Math.abs(remain).toLocaleString()} kcal over your target today. That's okay - aim for balance across the week.`
    default:         return "Keep logging your meals to stay on track."
  }
}

// ── DAILY PLAN GENERATOR ───────────────────────────────────────
const MEAL_PLANS: Record<string, DailyPlan> = {
  Nigeria: {
    breakfast: ['Akara (3 pieces) + Thin Pap', 'Moi Moi (2) + Boiled Eggs (2)', 'Ogi + Boiled Eggs'],
    lunch:     ['Jollof Brown Rice (half) + Chicken', 'Egusi Soup + Stockfish (no swallow)', 'Pepper Soup + Goat Meat'],
    snack:     ['Boiled Groundnuts (small handful)', 'Garden Egg + small sauce', 'Roasted Plantain (1 finger)'],
    dinner:    ['Efo Riro + Grilled Chicken (no swallow)', 'Ofe Onugbu + Assorted Meat', 'Vegetable Soup + Catfish (no swallow)'],
    avoid:     ['Fried plantain (dodo)', 'Puff puff', 'Chin chin', 'Large eba or fufu', 'Banga soup with excess oil', 'Malt or Chapman', 'Nkwobi or Isi Ewu'],
    exercise:  [],
    totalCalories: 0,
  },
  UK: {
    breakfast: ['Akara (3) + Pap (no sugar)', 'Moi Moi (2) + Ginger Tea', 'Scrambled Eggs + Tomato + Black Tea'],
    lunch:     ['Brown Rice (half) + Egusi + Stockfish', 'Grilled Chicken + Steamed Veg', 'Jollof Brown Rice + Baked Fish'],
    snack:     ['Apple or Pear (1 small)', 'Cucumber + Hummus', 'Greek Yoghurt (no sugar)'],
    dinner:    ['Catfish Stew + Steamed Spinach (no swallow)', 'Grilled Salmon + Broccoli', 'Efo Riro + Grilled Chicken'],
    avoid:     ['Fried plantain', 'Takeaway chips', 'Sugary drinks', 'White bread at dinner', 'Cream sauces', 'Alcohol (counts as calories)'],
    exercise:  [],
    totalCalories: 0,
  },
  USA: {
    breakfast: ['Egg white omelette + Vegetables', 'Greek Yoghurt + Berries', 'Oatmeal + Banana'],
    lunch:     ['Grilled Chicken Salad', 'Turkey Wrap (whole grain)', 'Soup + Lean Protein'],
    snack:     ['Apple + Almond Butter', 'Celery + Hummus', 'Handful Mixed Nuts'],
    dinner:    ['Grilled Salmon + Asparagus', 'Stir Fry Chicken + Brown Rice', 'Lean Beef + Sweet Potato'],
    avoid:     ['Fast food', 'Sugary sodas', 'White bread', 'Processed snacks', 'Fried anything', 'Alcohol'],
    exercise:  [],
    totalCalories: 0,
  },
  Ghana: {
    breakfast: ['Hausa Koko + Koose', 'Waakye (small) + Boiled Egg', 'Tom Brown + Boiled Egg'],
    lunch:     ['Banku (small) + Tilapia + Pepper Sauce', 'Kenkey (half) + Grilled Fish', 'Light Soup + Chicken (no fufu)'],
    snack:     ['Kelewele (small portion)', 'Coconut (fresh)', 'Groundnut (small handful)'],
    dinner:    ['Grilled Tilapia + Garden Egg Stew', 'Light Soup + Chicken (no starchy sides)', 'Okra Soup + Grilled Fish'],
    avoid:     ['Fried yam', 'Sugary sobolo', 'Large fufu portions', 'Fried fish (opt for grilled)', 'Asaana or sugary drinks'],
    exercise:  [],
    totalCalories: 0,
  },
}

const DEFAULT_PLAN = MEAL_PLANS.UK

export function getDailyPlan(country: string): DailyPlan {
  return MEAL_PLANS[country] ?? DEFAULT_PLAN
}

// ── EXERCISE RECOMMENDATIONS ───────────────────────────────────
const EXERCISES: Record<Activity, ExerciseItem[]> = {
  sedentary: [
    { title: '15-min gentle walk', detail: 'Around the block or indoors — just get moving', burn: 60, duration: '15 min' },
    { title: '10-min chair stretches', detail: 'Seated mobility routine for desk workers', burn: 30, duration: '10 min' },
  ],
  light: [
    { title: '30-min brisk walk', detail: 'Maintain a pace where you can just hold a conversation', burn: 150, duration: '30 min' },
    { title: '20-min bodyweight circuit', detail: 'Squats 15, push-ups 10, lunges 10 — repeat 2 rounds', burn: 120, duration: '20 min' },
  ],
  moderate: [
    { title: '30-min HIIT session', detail: 'YouTube: 30 seconds on / 30 seconds off — full intensity', burn: 300, duration: '30 min' },
    { title: '20-min strength circuit', detail: '3 rounds: squats 20, push-ups 15, plank 45sec, burpees 10', burn: 180, duration: '20 min' },
  ],
  active: [
    { title: '45-min run or cycle', detail: 'Moderate to high intensity sustained cardio', burn: 400, duration: '45 min' },
    { title: '30-min HIIT + Core', detail: 'Full HIIT session followed by 10-min core finisher', burn: 350, duration: '40 min' },
  ],
}

export function getExercises(activity: Activity): ExerciseItem[] {
  return EXERCISES[activity]
}

// ── UTILS ──────────────────────────────────────────────────────
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatKcal(n: number): string {
  return n.toLocaleString() + ' kcal'
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours()
  if (hour < 12) return `Good morning, ${name}!`
  if (hour < 17) return `Good afternoon, ${name}!`
  return `Good evening, ${name}!`
}
