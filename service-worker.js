const CACHE_NAME = 'reye-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/opencv.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/favicon-32x32.png',  
];

// نصب Service Worker و کش فایل‌ها
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// فعال شدن Service Worker و حذف کش‌های قدیمی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// پاسخ به درخواست‌ها: اول تلاش می‌کنیم از کش بخوانیم، اگر نبود از شبکه بگیریم و در کش ذخیره کنیم
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
