'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// The localized-catalog code that owns the current URL (`com_fr`, `en_en`, …).
// It is resolved on the SERVER, in app/[locale]/layout.tsx, and handed down — that is
// the whole point of Phase 2. Nothing here re-derives it from the pathname, so there is
// exactly one source of truth and no server/client disagreement to hydrate against.
const LocaleContext = createContext<string | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): string {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error('useLocale must be used inside LocaleProvider');
  return locale;
}

// Prefixes an app-internal path with the locale segment. Leaves anything that is not a
// site-relative path alone (absolute URLs, anchors, mailto:), and is idempotent so a
// path that already carries the segment is not double-prefixed.
export function withLocale(locale: string, path: string): string {
  if (!path.startsWith('/')) return path;
  if (path === `/${locale}` || path.startsWith(`/${locale}/`)) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

// Returns a prefixing function for imperative navigation (router.push targets), where a
// <LocaleLink> cannot be used.
export function useLocaleHref(): (path: string) => string {
  const locale = useLocale();
  return (path: string) => withLocale(locale, path);
}

// The inverse of withLocale: strips the locale segment off a real pathname.
// `usePathname()` returns the URL as routed — `/com_en/blog`, never `/blog` — so any
// comparison against an app-internal path ('/explain', startsWith('/category')) is
// silently false without this. Use useAppPathname() below rather than calling it
// directly.
export function withoutLocale(locale: string, pathname: string): string {
  if (pathname === `/${locale}`) return '/';
  if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  return pathname;
}

// The current pathname in the same shape call sites write hrefs in: locale segment
// removed, leading slash kept, '/' for the homepage. This is what to compare routes
// against.
export function useAppPathname(): string {
  const locale = useLocale();
  return withoutLocale(locale, usePathname());
}
