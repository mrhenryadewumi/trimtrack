import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { image, mediaType } = body

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API not configured' }, { status: 503 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: image,
                },
              },
              {
                type: 'text',
                text: `You are a nutrition expert specialising in Nigerian, West African, and global foods.

Analyse this food photo and return ONLY a valid JSON object with no other text.

If you can identify food:
{
  "identified": true,
  "meal_name": "name of the dish",
  "description": "brief description in 1 sentence",
  "kcal": estimated calories as number,
  "protein": grams of protein as number,
  "carbs": grams of carbs as number,
  "fat": grams of fat as number,
  "confidence": "high" or "medium" or "low",
  "notes": "any important notes about the estimate"
}

If you cannot identify food:
{
  "identified": false,
  "message": "Could not identify food in this image"
}

Important:
- Be specific with Nigerian/West African foods (Jollof Rice, Egusi Soup, Moi Moi, Pepper Soup, Efo Riro, Akara, Suya, Fufu, Eba, Pounded Yam, Banga Soup, etc)
- Estimate for a typical single serving portion
- If multiple foods are visible, estimate the total
- Be accurate — people are tracking calories for weight loss`
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'Claude API error')
    }

    const data = await response.json()
    const text = data.content[0]?.text || ''

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse response')
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)

  } catch (err) {
    console.error('Photo scan error:', err)
    return NextResponse.json({ error: 'Failed to analyse image' }, { status: 500 })
  }
}
