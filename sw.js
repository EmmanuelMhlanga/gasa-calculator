const cacheName = 'gasa-calculator-v1'; // Update version here to force refresh
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&display=swap'
];

// 1. Install Event: High-speed caching of the "Elite" assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[Gasa Tech] Caching system files');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); // Forces the waiting service worker to become active
});

// 2. Activate Event: Cleanup old caches (Crucial for Store Updates)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            console.log('[Gasa Tech] Removing outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Fetch Event: Offline-first strategy
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cacheRes => {
      // Return cached file OR fetch from network
      return cacheRes || fetch(e.request).catch(() => {
        // Fallback logic if both fail (e.g., if user is offline and asset isn't cached)
        if (e.request.url.indexOf('.html') > -1) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
});
