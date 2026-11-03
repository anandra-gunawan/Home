/* =========================================================
   ⭐ Naikkan angka VERSION setiap kali rilis versi baru.
   ========================================================= */
const VERSION = '1.0.1';
const CACHE   = 'portal-' + VERSION;
const ASSETS  = ['./', './index.html'];

/* Install: simpan cache versi baru (TIDAK skipWaiting —
   biarkan menunggu sampai pengguna klik "Perbarui") */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
});

/* Activate: hapus cache versi lama, ambil kendali */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* Terima perintah SKIP_WAITING dari halaman */
self.addEventListener('message', event => {
  if(event.data === 'SKIP_WAITING') self.skipWaiting();
});

/* Fetch: network-first untuk navigasi, cache-first untuk aset */
self.addEventListener('fetch', event => {
  const req = event.request;

  if(req.mode === 'navigate'){
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then(r => r || caches.match('./index.html'))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(r => r || fetch(req))
  );
});
