const CACHE = 'belcito-v4';
const ASSETS = [
  '/checklist-preventiva/',
  '/checklist-preventiva/index.html',
  '/checklist-preventiva/manifest.json',
  '/checklist-preventiva/icon.png',
  '/checklist-preventiva/icon-maskable.png',
  // libs de CDN: precisam estar em cache pro app abrir sem rede
  'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
];

self.addEventListener('install', e => {
  // fetch+put um por um (não addAll): um CDN fora do ar não pode derrubar o install inteiro
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.allSettled(
      ASSETS.map(u => fetch(new Request(u, { mode: 'no-cors' })).then(res => c.put(u, res)))
    ))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firestore usa long-polling/streaming: não cachear, deixa passar direto
  if (e.request.url.includes('firestore.googleapis.com')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
