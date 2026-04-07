// OpenFoodFacts API integration
// Free, no API key needed, 3M+ foods including Nigerian brands

export interface FoodResult {
  id: string
  name: string
  brand?: string
  kcal: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  serving?: string
  image?: string
  source: 'openfoodfacts' | 'local'
}

// Search OpenFoodFacts by name
export async function searchOpenFoodFacts(query: string, country = 'world'): Promise<FoodResult[]> {
  if (!query || query.length < 2) return []

  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&fields=id,product_name,brands,nutriments,serving_size,image_small_url`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'TrimTrack - calorie tracker - contact@trimtrack.co' },
    })

    if (!res.ok) throw new Error('OpenFoodFacts error')

    const data = await res.json()

    if (!data.products) return []

    return data.products
      .filter((p: Record<string, unknown>) => {
        const n = p.nutriments as Record<string, number>
        return p.product_name && n?.['energy-kcal_100g']
      })
      .map((p: Record<string, unknown>) => {
        const n = p.nutriments as Record<string, number>
        const kcal100 = n['energy-kcal_100g'] || 0
        // Estimate per typical serving (assume 100g if no serving size)
        const servingG = parseServingG(p.serving_size as string) || 100
        const ratio = servingG / 100

        return {
          id: `off_${p.id || p.code}`,
          name: p.product_name as string,
          brand: p.brands as string || undefined,
          kcal: Math.round(kcal100 * ratio),
          protein: Math.round((n['proteins_100g'] || 0) * ratio * 10) / 10,
          carbs: Math.round((n['carbohydrates_100g'] || 0) * ratio * 10) / 10,
          fat: Math.round((n['fat_100g'] || 0) * ratio * 10) / 10,
          fiber: Math.round((n['fiber_100g'] || 0) * ratio * 10) / 10,
          serving: p.serving_size as string || '100g',
          image: p.image_small_url as string || undefined,
          source: 'openfoodfacts' as const,
        }
      })
      .filter((f: FoodResult) => f.kcal > 0 && f.kcal < 2000)
      .slice(0, 12)
  } catch (err) {
    console.error('OpenFoodFacts search error:', err)
    return []
  }
}

// Get food by barcode
export async function getFoodByBarcode(barcode: string): Promise<FoodResult | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { headers: { 'User-Agent': 'TrimTrack - calorie tracker - contact@trimtrack.co' } }
    )

    if (!res.ok) throw new Error('Not found')
    const data = await res.json()

    if (data.status !== 1 || !data.product) return null

    const p = data.product
    const n = p.nutriments || {}
    const kcal100 = n['energy-kcal_100g'] || 0
    const servingG = parseServingG(p.serving_size) || 100
    const ratio = servingG / 100

    return {
      id: `off_${barcode}`,
      name: p.product_name || 'Unknown product',
      brand: p.brands || undefined,
      kcal: Math.round(kcal100 * ratio),
      protein: Math.round((n['proteins_100g'] || 0) * ratio * 10) / 10,
      carbs: Math.round((n['carbohydrates_100g'] || 0) * ratio * 10) / 10,
      fat: Math.round((n['fat_100g'] || 0) * ratio * 10) / 10,
      serving: p.serving_size || '100g',
      image: p.image_small_url || undefined,
      source: 'openfoodfacts',
    }
  } catch (err) {
    console.error('Barcode lookup error:', err)
    return null
  }
}

function parseServingG(serving?: string): number | null {
  if (!serving) return null
  const match = serving.match(/(\d+(?:\.\d+)?)\s*g/i)
  if (match) return parseFloat(match[1])
  const mlMatch = serving.match(/(\d+(?:\.\d+)?)\s*ml/i)
  if (mlMatch) return parseFloat(mlMatch[1])
  return null
}
