// Infinity Ventures Service Worker v2.0
const CACHE_NAME = 'iv-cache-v2';
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
  ];

// Install
self.addEventListener('install', (event) => {
    event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
        );
    self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
          caches.keys().then((names) =>
                  Promise.all(
                            names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
                          )
                                 )
        );
    self.clients.claim();
});

// Fetch — Network first, cache fallback (same-origin only)
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

                        // Skip cross-origin requests (Google Fonts, analytics, etc.)
                        const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

                        // Skip API requests
                        if (url.pathname.startsWith('/api/')) return;

                        event.respondWith(
                              fetch(event.request)
                                .then((response) => {
                                          if (response.ok) {
                                                      const clone = response.clone();
                                                      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                                          }
                                          return response;
                                })
                                .catch(() => caches.match(event.request).then((r) => r || caches.match('/')))
                            );
});
