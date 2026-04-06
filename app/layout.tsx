import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrimTrack — Your Weight Loss Journey, Simplified',
  description: 'Personalised meal plans, real-time calorie tracking, and daily reminders built around food you actually love.',
  keywords: ['weight loss', 'calorie tracker', 'meal plan', 'Nigerian food', 'diet app'],
  openGraph: {
    title: 'TrimTrack',
    description: 'Lose weight eating food you love.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6fbf8]">
        {children}
      </body>
    </html>
  )
}
