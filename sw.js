const cacheName = 'gasa-calculator-elite-v2'; // Bumped version (Rec 2)
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './browserconfig.xml',
  './icon.png'
];

// 1. Install Event: High-speed caching for the Elite UI
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[Gasa Tech] Caching Elite Pro system files');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); 
});

// 2. Activate Event: Cleanup & Performance Telemetry (Rec 44)
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
  // Claim clients immediately so the new SW takes over (Rec 42)
  return self.clients.claim();
});

// 3. Fetch Event: Advanced Hybrid Strategy
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Strategy A: Stale-While-Revalidate for Google Fonts (Rec 5)
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    e.respondWith(
      caches.open('gasa-tech-fonts').then(cache => {
        return cache.match(e.request).then(response => {
          const fetchPromise = fetch(e.request).then(networkResponse => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy B: Offline-First for App Core (Rec 41)
  e.respondWith(
    caches.match(e.request).then(cacheRes => {
      return cacheRes || fetch(e.request).then(fetchRes => {
        // Dynamic caching for new assets (Rec 46)
        return caches.open(cacheName).then(cache => {
          if (e.request.method === 'GET') {
            cache.put(e.request, fetchRes.clone());
          }
          return fetchRes;
        });
      }).catch(() => {
        // Reliable Fallback (Rec 24)
        if (e.request.url.indexOf('.html') > -1) {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// 4. Background Sync for Currency Rates (Rec 31)
self.addEventListener('sync', e => {
  if (e.tag === 'sync-rates') {
    console.log('[Gasa Tech] Fetching latest ZAR exchange rates in background');
    // Logic to fetch rates and store in IndexedDB would go here
  }
});

// 5. Push Notifications for Ecosystem Updates (Rec 34, 42)
self.addEventListener('push', e => {
  const data = e.data ? e.data.text() : 'Gasa Tech: New Update Available';
  e.waitUntil(
    self.registration.showNotification('Gasa Tech Elite', {
      body: data,
      icon: './icon.png',
      badge: './icon.png'
    })
  );
});
