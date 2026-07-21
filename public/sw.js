const CACHE_NAME = 'trimtrack-v3'
const STATIC_ASSETS = [
  '/', '/dashboard', '/community', '/coach', '/onboarding',
  '/login', '/profile', '/statements', '/trial',
  '/manifest.json', '/icon-192.png', '/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (event.request.url.includes('/api/')) return
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      }).catch(() => cached)
      return cached || network
    })
  )
})

// --- Push notifications (daily reminders) ---
self.addEventListener('push', (event) => {
  let data = { title: 'TrimTrack', body: 'Time to log your meal 🍽️' }
  try { if (event.data) data = { ...data, ...event.data.json() } } catch (e) {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: data.url || '/dashboard' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/dashboard'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const open = list.find((c) => c.url.includes(url))
      if (open) return open.focus()
      return clients.openWindow(url)
    })
  )
})

// --- Background Sync (retry failed meal logs) ---
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-meals') {
    event.waitUntil(
      self.registration.showNotification('TrimTrack', { body: 'Your meals are synced ✅', icon: '/icon-192.png' })
    )
  }
})

// --- Periodic Sync (refresh daily goal) ---
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-day') {
    event.waitUntil(caches.open(CACHE_NAME).then((c) => c.add('/dashboard')))
  }
})