// ============================================================
// SERVICE WORKER — Vocal Radio
// Stratégie : Cache-first pour les assets statiques
//             Network-only pour les flux audio (streaming)
// ============================================================

const CACHE_NAME = 'vocal-radio-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  // Google Fonts (mises en cache au premier chargement)
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap',
];

// Domaines des flux audio — jamais mis en cache
const STREAM_DOMAINS = [
  'icecast.radiofrance.fr',
];

// ----------------------------------------
// INSTALL : pré-cache des assets statiques
// ----------------------------------------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Pré-cache partiel :', err);
      });
    })
  );
  self.skipWaiting();
});

// ----------------------------------------
// ACTIVATE : nettoyage des vieux caches
// ----------------------------------------
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ----------------------------------------
// FETCH : stratégie hybride
// ----------------------------------------
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Flux audio → réseau direct, pas de cache
  if (STREAM_DOMAINS.some(d => url.hostname.includes(d))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. Assets statiques → Cache-first, réseau en fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Mettre en cache les réponses valides (pas les opaque)
        if (
          response &&
          response.status === 200 &&
          response.type !== 'opaque'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback hors-ligne : renvoyer index.html si navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
