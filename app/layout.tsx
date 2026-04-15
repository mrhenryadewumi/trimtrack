import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrimTrack - The calorie tracker that understands your food',
  description: 'AI-powered calorie tracking built for Nigerian and African food. Scan your meal, get instant calories, and lose weight eating food you love. Free 30-day trial.',
  keywords: ['calorie tracker', 'African food', 'African food', 'weight loss app', 'AI food scanner', 'jollof rice calories', 'egusi calories', 'Nigerian diet'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TrimTrack',
  },
  openGraph: {
    title: 'TrimTrack - The calorie tracker that understands your food',
    description: 'AI-powered calorie tracking built for Nigerian and African food. Free 30-day trial. No credit card.',
    type: 'website',
    url: 'https://www.trimtrack.fit',
    siteName: 'TrimTrack',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrimTrack - The calorie tracker that understands your food',
    description: 'AI-powered calorie tracking built for Nigerian and African food. Free 30-day trial.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.trimtrack.fit',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1a5c38" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TrimTrack" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-[#f6fbf8]">
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function(err) {
                console.log('SW registration failed:', err);
              });
            });
          }
        `}} />
      </body>
    </html>
  )
}