import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {

  const stripeKey = process.env.STRIPE_SECRET_KEY

  // ? BUILD SAFE
  if (!stripeKey) {
    return NextResponse.json({ skip: true })
  }

  const { default: Stripe } = await import('stripe')
  const stripe = new Stripe(stripeKey, {
    apiVersion: '2026-03-25.dahlia'
  })

  try {
    // your checkout logic here
    return NextResponse.json({ ok: true })

  } catch {
    return NextResponse.json({ error: "Checkout error" }, { status: 500 })
  }
}
