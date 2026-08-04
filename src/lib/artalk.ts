import { siteConfig } from "@/lib/config";

const importArtalk = () => import("artalk");
type ArtalkCtor = Awaited<ReturnType<typeof importArtalk>>["default"];

export const commentsConfigured = Boolean(siteConfig.artalkServer && siteConfig.artalkSite);

let pending: Promise<ArtalkCtor> | null = null;

/**
 * Loads the Artalk bundle (JS + CSS) at most once. The hover prefetch and the
 * real init inside the dialog share this promise, so reopening the board never
 * re-downloads the ~60 kB chunk.
 */
export function loadArtalk(): Promise<ArtalkCtor> {
  pending ??= Promise.all([importArtalk(), import("artalk/Artalk.css")])
    .then(([mod]) => mod.default)
    .catch((err: unknown) => {
      // Don't cache the rejection — a later open should be able to retry.
      pending = null;
      throw err;
    });
  return pending;
}

/** Warms the bundle on pointer/focus intent so opening the board feels instant. */
export function prefetchArtalk(): void {
  if (!commentsConfigured) return;
  void loadArtalk().catch(() => {});
}
