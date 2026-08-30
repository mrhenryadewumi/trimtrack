import { FOODS } from "@/lib/foods";
import { searchOpenFoodFacts } from "@/lib/openfoodfacts";
import { searchUSDA } from "@/lib/usda";

export type ResolvedNutrition = {
  meal_name: string
  kcal: number
  protein: number
  carbs: number
  fat: number
  source: string
  estimate: boolean
};

function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function matchLocalFood(name: string) {
  const n = norm(name);
  if (!n) return null;
  let best: (typeof FOODS)[number] | null = null;
  let bestLen = 0;
  for (const f of FOODS) {
    const nm = norm(f.name);
    if (!nm) continue;
    const exact = n === nm;
    const contains = nm.length >= 4 && (n.includes(nm) || nm.includes(n));
    if ((exact || contains) && nm.length > bestLen) {
      best = f;
      bestLen = nm.length;
    }
  }
  return best;
}

/**
 * Camera names the dish. Calories come from a table, not from the model.
 * Order: TrimTrack catalog (West African portions) -> Open Food Facts -> USDA.
 */
export async function resolveScanNutrition(
  mealName: string,
): Promise<ResolvedNutrition> {
  const local = matchLocalFood(mealName);
  if (local) {
    return {
      meal_name: local.name,
      kcal: local.kcal,
      protein: local.protein,
      carbs: local.carbs,
      fat: local.fat,
      source:
        "TrimTrack catalog - typical Nigerian home portion (USDA / FAO WAFCT 2019).",
      estimate: false,
    };
  }

  const off = await searchOpenFoodFacts(mealName);
  if (off[0] && off[0].kcal > 0) {
    const hit = off[0];
    return {
      meal_name: hit.brand ? `${hit.name} (${hit.brand})` : hit.name,
      kcal: hit.kcal,
      protein: hit.protein,
      carbs: hit.carbs,
      fat: hit.fat,
      source: `Open Food Facts${hit.serving ? " - " + hit.serving : ""}`,
      estimate: false,
    };
  }

  const usda = await searchUSDA(mealName);
  if (usda[0] && usda[0].kcal > 0) {
    const hit = usda[0];
    return {
      meal_name: hit.name,
      kcal: hit.kcal,
      protein: hit.protein,
      carbs: hit.carbs,
      fat: hit.fat,
      source: "USDA FoodData Central - 100 g",
      estimate: false,
    };
  }

  return {
    meal_name: mealName,
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    source:
      "No table match - we will not invent calories. Search the food list instead.",
    estimate: true,
  };
}
