const CACHE = 'voice-timer-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const r = await c.match(e.request);
    if (r) return r;
    try {
      const f = await fetch(e.request);
      c.put(e.request, f.clone());
      return f;
    } catch {
      return r || new Response('Offline', { status: 503 });
    }
  })());
});
