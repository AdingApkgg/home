/// <reference lib="webworker" />
import type { PrecacheEntry, SerwistGlobalConfig, RuntimeCaching, SerwistPlugin } from "serwist";
import {
  CacheableResponsePlugin,
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const isSameOrigin = (url: URL) => url.origin === self.location.origin;
const sameOriginPath =
  (re: RegExp) =>
  ({ url }: { url: URL }) =>
    isSameOrigin(url) && re.test(url.pathname);

const strategies = [
  {
    name: "static-assets",
    handler: "CacheFirst" as const,
    match: /^\/_next\/static\//,
    maxEntries: 100,
    maxAgeSeconds: 60 * 60 * 24 * 365,
  },
  {
    name: "images",
    handler: "CacheFirst" as const,
    match: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
    maxEntries: 80,
    maxAgeSeconds: 60 * 60 * 24 * 30,
    purgeOnQuotaError: true,
  },
  {
    name: "fonts",
    handler: "CacheFirst" as const,
    match: /\.(?:woff|woff2|ttf|otf|eot)$/i,
    maxEntries: 20,
    maxAgeSeconds: 60 * 60 * 24 * 365,
  },
  {
    name: "js-css",
    handler: "StaleWhileRevalidate" as const,
    match: /\.(?:js|css)$/i,
    maxEntries: 60,
    maxAgeSeconds: 60 * 60 * 24 * 7,
    purgeOnQuotaError: true,
  },
] as const;

const KNOWN_CACHES = new Set<string>([...strategies.map((s) => s.name), "pages"]);

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((name) => !KNOWN_CACHES.has(name)).map((name) => caches.delete(name))),
      ),
  );
});

const handlerFor = (s: (typeof strategies)[number]) => {
  const plugins: SerwistPlugin[] = [
    new CacheableResponsePlugin({ statuses: [200] }) as SerwistPlugin,
    new ExpirationPlugin({
      maxEntries: s.maxEntries,
      maxAgeSeconds: s.maxAgeSeconds,
      ...("purgeOnQuotaError" in s && s.purgeOnQuotaError ? { purgeOnQuotaError: true } : {}),
    }) as SerwistPlugin,
  ];
  const options = { cacheName: s.name, plugins };
  switch (s.handler) {
    case "CacheFirst":
      return new CacheFirst(options);
    case "StaleWhileRevalidate":
      return new StaleWhileRevalidate(options);
  }
};

const runtimeCaching: RuntimeCaching[] = [
  ...strategies.map((s) => ({ matcher: sameOriginPath(s.match), handler: handlerFor(s) })),
  {
    matcher: ({ request, url }) => isSameOrigin(url) && request.mode === "navigate",
    handler: new NetworkFirst({
      cacheName: "pages",
      plugins: [
        new CacheableResponsePlugin({ statuses: [200] }) as SerwistPlugin,
        new ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24,
          purgeOnQuotaError: true,
        }) as SerwistPlugin,
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST ?? [],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
});

serwist.addEventListeners();
