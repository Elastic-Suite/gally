import { ILocalizedCatalog, LANGUAGES, DEFAULT_LANGUAGE } from './catalogs';

// One definition of the public origin. It was copy-pasted into three route files during
// Phase 3; a canonical URL that disagrees between routes is worse than none at all,
// because it tells a crawler two different things about the same site.
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://gally.localhost';
export const SITE = `${SITE_ORIGIN}/example`;

export const SITE_NAME = 'Gally';

export function canonical(locale: string, path = ''): string {
  return `${SITE}/${locale}${path}`;
}

export function languageOf(localizedCatalog: ILocalizedCatalog): string {
  return LANGUAGES[localizedCatalog.locale] || DEFAULT_LANGUAGE;
}

// Product descriptions and CMS summaries are stored as HTML. Dropped straight into a
// <meta name="description"> they arrive as escaped markup ("&lt;p&gt;The Claudia..."),
// which is what a search engine would then show. Strip tags, collapse whitespace,
// decode the handful of entities that survive, and trim to a sane length.
export function toMetaDescription(html: string | undefined, max = 300): string | undefined {
  if (!html) return undefined;
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return undefined;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

// Pages that must never be indexed: they are either per-session state (cart, checkout),
// infinite query-string surface that would dilute the real pages (search), or demo
// scaffolding with no standalone meaning (explain, closing). They still get a <title>,
// because a titled tab is a usability question and indexing is a separate one.
export const NOINDEX = {
  robots: { index: false, follow: true },
} as const;

// Next merges `openGraph` shallowly: a page that sets its own openGraph object REPLACES
// the parent layout's rather than extending it, so the root layout's siteName silently
// vanished from every page that set a title. Spread this into each page's openGraph
// instead of relying on inheritance.
export function openGraphBase(localizedCatalog: ILocalizedCatalog) {
  return {
    siteName: SITE_NAME,
    // e.g. "en_US" / "fr_FR" — already the shape Open Graph wants.
    locale: localizedCatalog.locale,
  };
}
