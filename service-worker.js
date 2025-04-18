const CACHE_NAME = "arretados-organizador-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/cadastro.html",
  "/style.css",
  "/firebase-config.js",
  "/painel.js",
  "/manifest.json",
  "/login.html"
];

// Instala o Service Worker e armazena os arquivos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativa e limpa caches antigos se necessário
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Intercepta requisições e serve do cache se offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resposta) => {
      return resposta || fetch(event.request);
    })
  );
});
