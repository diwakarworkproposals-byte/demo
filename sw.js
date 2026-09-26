// ASAN BILL Service Worker — Offline & PWA Support
const CACHE_NAME = 'asan-bill-cache-v1';

// Critical core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/demo/',
  '/demo/index.html',
  '/demo/manifest.json',
  '/demo/favicon.svg',
  '/demo/icon.svg',
  '/demo/icon-192.png',
  '/demo/icon-512.png',
  '/demo/apple-touch-icon.png'
];

// Install Event: pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Best-effort precaching: individual failures won't reject the whole installation
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch((err) => console.log('Precache skip:', url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate with Navigation Fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Handle SPA Navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Clone and cache the latest index.html
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/demo/index.html', copy));
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const cachedIndex = await caches.match('/demo/index.html');
          if (cachedIndex) return cachedIndex;
          const cachedRoot = await caches.match('/demo/');
          if (cachedRoot) return cachedRoot;
          return new Response(
            '<html><body><h1>ASAN BILL Offline</h1><p>You appear to be offline. Reconnect to sync.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Handle static assets (JS, CSS, images, fonts)
  const url = new URL(request.url);
  const isStatic =
    url.origin === location.origin ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
