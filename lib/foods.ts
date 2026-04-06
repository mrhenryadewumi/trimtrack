import type { FoodItem } from '@/types'

export const FOODS: FoodItem[] = [
  // PROTEIN
  { id: 1,  name: 'Moi Moi (1 piece)',             category: 'protein', kcal: 160, protein: 9,  carbs: 18, fat: 5  },
  { id: 2,  name: 'Akara (1 piece)',               category: 'protein', kcal: 110, protein: 5,  carbs: 12, fat: 5  },
  { id: 3,  name: 'Boiled Egg',                    category: 'protein', kcal: 78,  protein: 6,  carbs: 1,  fat: 5  },
  { id: 4,  name: 'Grilled Chicken (100g)',         category: 'protein', kcal: 165, protein: 31, carbs: 0,  fat: 4  },
  { id: 5,  name: 'Grilled Fish / Tilapia (100g)', category: 'protein', kcal: 128, protein: 26, carbs: 0,  fat: 3  },
  { id: 6,  name: 'Catfish (100g)',                category: 'protein', kcal: 105, protein: 18, carbs: 0,  fat: 3  },
  { id: 7,  name: 'Goat Meat (100g)',              category: 'protein', kcal: 143, protein: 27, carbs: 0,  fat: 3  },
  { id: 8,  name: 'Stockfish (50g)',               category: 'protein', kcal: 80,  protein: 17, carbs: 0,  fat: 1  },
  { id: 9,  name: 'Smoked Mackerel (100g)',        category: 'protein', kcal: 205, protein: 19, carbs: 0,  fat: 14 },
  { id: 10, name: 'Chicken Drumstick (grilled)',   category: 'protein', kcal: 185, protein: 27, carbs: 0,  fat: 8  },
  { id: 11, name: 'Boiled Eggs (2)',               category: 'protein', kcal: 156, protein: 12, carbs: 2,  fat: 10 },
  { id: 12, name: 'Greek Yoghurt (100g)',          category: 'protein', kcal: 97,  protein: 9,  carbs: 6,  fat: 5  },
  // CARBS
  { id: 20, name: 'Brown Rice (half cup cooked)',  category: 'carbs',   kcal: 110, protein: 3,  carbs: 23, fat: 1  },
  { id: 21, name: 'Jollof Brown Rice (half cup)',  category: 'carbs',   kcal: 140, protein: 3,  carbs: 27, fat: 3  },
  { id: 22, name: 'Eba / Garri (small ball)',      category: 'carbs',   kcal: 180, protein: 2,  carbs: 42, fat: 0  },
  { id: 23, name: 'Fufu (small ball)',             category: 'carbs',   kcal: 160, protein: 1,  carbs: 38, fat: 0  },
  { id: 24, name: 'Boiled Yam (half cup)',         category: 'carbs',   kcal: 118, protein: 2,  carbs: 28, fat: 0  },
  { id: 25, name: 'Boiled Plantain (1 finger)',    category: 'carbs',   kcal: 122, protein: 1,  carbs: 31, fat: 0  },
  { id: 26, name: 'Roasted Plantain (1 finger)',   category: 'carbs',   kcal: 109, protein: 1,  carbs: 28, fat: 0  },
  { id: 27, name: 'Pap / Ogi (1 bowl)',            category: 'carbs',   kcal: 90,  protein: 2,  carbs: 20, fat: 1  },
  { id: 28, name: 'Ofada Rice (half cup)',         category: 'carbs',   kcal: 115, protein: 3,  carbs: 24, fat: 1  },
  // VEG / SOUPS
  { id: 30, name: 'Egusi Soup (1 ladle)',          category: 'veg',     kcal: 190, protein: 8,  carbs: 5,  fat: 15 },
  { id: 31, name: 'Efo Riro (1 ladle)',            category: 'veg',     kcal: 120, protein: 5,  carbs: 6,  fat: 9  },
  { id: 32, name: 'Pepper Soup (1 bowl)',          category: 'veg',     kcal: 180, protein: 18, carbs: 4,  fat: 9  },
  { id: 33, name: 'Vegetable Soup (1 ladle)',      category: 'veg',     kcal: 100, protein: 5,  carbs: 8,  fat: 6  },
  { id: 34, name: 'Ofe Onugbu (1 ladle)',          category: 'veg',     kcal: 150, protein: 6,  carbs: 7,  fat: 11 },
  { id: 35, name: 'Bitter Leaf Soup (1 ladle)',    category: 'veg',     kcal: 130, protein: 5,  carbs: 6,  fat: 9  },
  { id: 36, name: 'Cucumber (half)',               category: 'veg',     kcal: 20,  protein: 1,  carbs: 4,  fat: 0  },
  { id: 37, name: 'Tomato (1 medium)',             category: 'veg',     kcal: 22,  protein: 1,  carbs: 5,  fat: 0  },
  { id: 38, name: 'Garden Egg (1)',                category: 'veg',     kcal: 24,  protein: 1,  carbs: 5,  fat: 0  },
  { id: 39, name: 'Spinach (1 cup)',               category: 'veg',     kcal: 23,  protein: 3,  carbs: 4,  fat: 0  },
  // SNACKS
  { id: 40, name: 'Boiled Groundnuts (handful)',   category: 'snack',   kcal: 160, protein: 7,  carbs: 6,  fat: 14 },
  { id: 41, name: 'Apple (1 small)',               category: 'snack',   kcal: 72,  protein: 0,  carbs: 19, fat: 0  },
  { id: 42, name: 'Pear (1 small)',                category: 'snack',   kcal: 57,  protein: 0,  carbs: 15, fat: 0  },
  { id: 43, name: 'Half Avocado',                  category: 'snack',   kcal: 120, protein: 2,  carbs: 6,  fat: 11 },
  { id: 44, name: 'Puff Puff (1 piece)',           category: 'snack',   kcal: 130, protein: 2,  carbs: 18, fat: 6  },
  { id: 45, name: 'Chin Chin (handful)',           category: 'snack',   kcal: 200, protein: 4,  carbs: 30, fat: 8  },
  // DRINKS
  { id: 50, name: 'Water (500ml)',                 category: 'drink',   kcal: 0,   protein: 0,  carbs: 0,  fat: 0  },
  { id: 51, name: 'Zobo (unsweetened, 1 glass)',   category: 'drink',   kcal: 15,  protein: 0,  carbs: 4,  fat: 0  },
  { id: 52, name: 'Zobo (with sugar, 1 glass)',    category: 'drink',   kcal: 90,  protein: 0,  carbs: 22, fat: 0  },
  { id: 53, name: 'Ginger Tea (no sugar)',         category: 'drink',   kcal: 5,   protein: 0,  carbs: 1,  fat: 0  },
  { id: 54, name: 'Black Coffee (no sugar)',       category: 'drink',   kcal: 5,   protein: 0,  carbs: 1,  fat: 0  },
  { id: 55, name: 'Malt (1 bottle)',               category: 'drink',   kcal: 180, protein: 4,  carbs: 38, fat: 0  },
  { id: 56, name: 'Chapman (1 glass)',             category: 'drink',   kcal: 200, protein: 1,  carbs: 48, fat: 0  },
  { id: 57, name: 'Lemon Water (1 glass)',         category: 'drink',   kcal: 10,  protein: 0,  carbs: 3,  fat: 0  },
]

export const FOOD_CATEGORIES = ['protein', 'carbs', 'veg', 'snack', 'drink'] as const
