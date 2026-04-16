// USDA FoodData Central API - free, no key needed for basic search
export async function searchUSDA(query: string): Promise<any[]> {
  try {
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=5&api_key=DEMO_KEY`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.foods || []).map((f: any) => {
      const nutrients = f.foodNutrients || []
      const get = (name: string) => {
        const n = nutrients.find((n: any) => n.nutrientName?.toLowerCase().includes(name.toLowerCase()))
        return Math.round(n?.value || 0)
      }
      return {
        id: `usda-${f.fdcId}`,
        name: f.description,
        source: 'usda',
        kcal: get('energy'),
        protein: get('protein'),
        carbs: get('carbohydrate'),
        fat: get('total lipid'),
      }
    }).filter((f: any) => f.kcal > 0)
  } catch {
    return []
  }
}