// Keeps the directory working offline and opening fast. Supplier data from Google always comes fresh when online.
const CACHE = 'elec-ksa-v13';
const SHELL = ['./', './index.html', './suppliers.json', './manifest.webmanifest', './icon-192.png', './icon-512.png', './fonts/plex-ar-400.woff2', './fonts/plex-ar-500.woff2', './fonts/plex-ar-700.woff2', './fonts/plex-lat-400.woff2', './fonts/plex-lat-500.woff2', './fonts/plex-lat-700.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('admin.html')) return;
  // network first, fall back to the saved copy when offline
  e.respondWith(fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
