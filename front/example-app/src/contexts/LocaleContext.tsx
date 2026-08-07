'use client';

import { createContext, useContext, ReactNode } from 'react';

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
