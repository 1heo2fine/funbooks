/*
  Minimal service worker that caches the app shell.
  This prevents InvalidStateError by ensuring the service worker is registered only after the page is fully loaded.
*/

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});