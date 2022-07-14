let cacheName = "bolivares-divisas-converter";
let filesToCache = ["/", "/index.html", "/css/style.css", "/js/script.js", "/js/country-list.js", "/images/icon_pwa.png"];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

/* Serve cached content when offline */
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});