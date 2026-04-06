export type Gender = 'male' | 'female' | 'other'
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active'
export type DrinkHabit = 'no' | 'occasional' | 'regular'

export interface UserProfile {
  id?: string
  name: string
  age: number
  gender: Gender
  country: string
  startWeight: number
  goalWeight: number
  height: number
  activity: Activity
  drink: DrinkHabit
  avoidFoods: string[]
  reminders: boolean
  dailyCalorieGoal: number
  createdAt?: string
}

export interface FoodItem {
  id: number
  name: string
  category: 'protein' | 'carbs' | 'veg' | 'snack' | 'drink'
  kcal: number
  protein: number
  carbs: number
  fat: number
  country?: string
}

export interface MealEntry {
  id?: string
  userId: string
  date: string
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner'
  foodName: string
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export interface WeightEntry {
  id?: string
  userId: string
  date: string
  weight: number
}

export interface DailyPlan {
  breakfast: string[]
  lunch: string[]
  snack: string[]
  dinner: string[]
  avoid: string[]
  exercise: ExerciseItem[]
  totalCalories: number
}

export interface ExerciseItem {
  title: string
  detail: string
  burn: number
  duration: string
}

export interface WaitlistEntry {
  email: string
  createdAt?: string
}

export type CalorieStatus = 'empty' | 'good' | 'warn' | 'critical' | 'over'
