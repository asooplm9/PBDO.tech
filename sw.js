const CACHE_NAME = 'pbdo-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/monitoring.html',
  '/radar.html',
  '/report.html',
  '/about.html',
  '/admin.html',
  '/contact.html',
  '/faq.html',
  '/status.html',
  '/privacy.html',
  '/terms.html',
  '/404.html',
  '/logo.svg',
  '/manifest.json',
  '/print.css',
  '/styles.css',
  '/scripts.js'
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
