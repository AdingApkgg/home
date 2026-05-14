// Tombstone service worker.
// The site no longer ships a PWA. Returning visitors still have the old SW
// registered; the browser fetches /sw.js on each navigation and notices this
// new version. On activation it unregisters itself and wipes its caches,
// then reloads any open tabs so they pick up the network-served version.

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) client.navigate(client.url);
    })(),
  );
});
