const CACHE_NAME = 'pbdo-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/404.html',
  '/privacy.html',
  '/terms.html',
  '/contact.html',
  '/faq.html',
  '/status.html',
  '/logo.svg',
  '/manifest.json',
  '/print.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);

  // Network-first for API calls
  if (url.hostname !== self.location.hostname || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, toCache);
        });
        return response;
      });
    })
  );
});
