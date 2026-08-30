export async function searchUSDA(query: string): Promise<{
  id: string
  name: string
  source: "usda"
  kcal: number
  protein: number
  carbs: number
  fat: number
}[]> {
  const key = process.env.USDA_FDC_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=5&api_key=${encodeURIComponent(key)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.foods || [])
      .map((f: {
        fdcId: number
        description: string
        foodNutrients?: { nutrientName?: string; unitName?: string; value?: number }[]
      }) => {
        const nutrients = f.foodNutrients || [];
        const get = (needle: string, unit?: string) => {
          const n = nutrients.find((row) => {
            const name = (row.nutrientName || "").toLowerCase();
            if (!name.includes(needle)) return false;
            if (unit && (row.unitName || "").toLowerCase() !== unit) return false;
            return true;
          });
          return Math.round((n?.value || 0) * 10) / 10;
        };
        return {
          id: `usda-${f.fdcId}`,
          name: f.description,
          source: "usda" as const,
          kcal: get("energy", "kcal") || get("energy"),
          protein: get("protein"),
          carbs: get("carbohydrate"),
          fat: get("total lipid"),
        };
      })
      .filter((f: { kcal: number }) => f.kcal > 0);
  } catch {
    return [];
  }
}
