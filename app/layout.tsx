import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrimTrack — Your Weight Loss Journey, Simplified',
  description: 'The only calorie tracker that knows Nigerian food. AI-powered meal scanning, personalised plans, and daily reminders.',
  keywords: ['weight loss', 'calorie tracker', 'Nigerian food', 'African food', 'diet app'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TrimTrack',
  },
  openGraph: {
    title: 'TrimTrack — Calorie tracking for Nigerian food',
    description: 'The only calorie tracker that knows Nigerian food.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1a5c38" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
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
