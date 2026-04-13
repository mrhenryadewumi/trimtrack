import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {

  const resendKey = process.env.RESEND_API_KEY

  // ? BUILD SAFE
  if (!resendKey) {
    return NextResponse.json({ skip: true })
  }

  const { Resend } = await import('resend')
  const resend = new Resend(resendKey)

  try {
    // your existing logic here
    return NextResponse.json({ success: true })

  } catch {
    return NextResponse.json({ error: "Email error" }, { status: 500 })
  }
}
