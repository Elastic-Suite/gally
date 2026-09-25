// Public Gally settings as path -> value, the same map the admin builds (gally-admin
// useDataLoader.ts). Fetched once per render by fetchPublicConfiguration() in ./server, scoped to
// the current localized catalog, and shared with client components through ConfigContext.
//
// No React and no fetch here, by design: the mappers in ./productFields and ./cmsFields import
// this from both server pages and client components.
export type GallyConfig = Record<string, string>;

// Used only when the endpoint is unreachable. Matches the API default on the local stack.
const MEDIA_FALLBACK = 'https://gally.localhost/media/catalog/product/';

// Documents store a path relative to the media base ("/toolbox/t/b/x.jpg"), and the base may or may not
// end in "/", so this joins without doubling or dropping the slash. The `default` catalog
// sometimes stores a one-item array. An absolute URL is kept as is.
export function mediaUrl(config: GallyConfig, path: string | string[] | undefined | null): string {
  const p = Array.isArray(path) ? path[0] : path;
  if (!p) return '';
  if (/^https?:\/\//.test(p)) return p;
  const base = config['gally.base_url.media'] || MEDIA_FALLBACK;
  return `${base.replace(/\/+$/, '')}/${p.replace(/^\/+/, '')}`;
}
