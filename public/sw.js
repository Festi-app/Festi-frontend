self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    return
  }

  if (!payload.title || !payload.url) return

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      data: { url: payload.url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const requestedPath = event.notification.data?.url ?? '/waitings'
  const targetUrl = new URL(requestedPath, self.location.origin)

  if (targetUrl.origin !== self.location.origin) return

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        const existing = windowClients.find(
          (c) => new URL(c.url).pathname === targetUrl.pathname
        )
        if (existing) {
          return existing.focus().then(() => existing.navigate(targetUrl.href))
        }
        return clients.openWindow(targetUrl.href)
      })
  )
})
