/* Service worker minimal — hanya dibutuhkan agar PWA bisa diinstal.
   Tidak melakukan caching. */

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',    () => { /* passthrough */ });
