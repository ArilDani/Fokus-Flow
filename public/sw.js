self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, options, delayMs } = event.data

    // We use setTimeout in the SW. 
    // Note: If the browser completely suspends the SW, this might fail.
    // Real push notifications require a backend server.
    // For a local app, this works as long as the browser keeps the SW alive.
    setTimeout(() => {
      self.registration.showNotification(title, options)
    }, delayMs)
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i]
        // If so, just focus it.
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
