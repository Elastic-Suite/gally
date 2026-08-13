# Bugfix: header nav never showed an active item — `usePathname()` carries the locale segment

## Status: implemented
## Page/Component: src/contexts/LocaleContext.tsx, src/components/Header.tsx

## Problem
No item in the header nav ever appeared selected, on any route. Found while verifying
`feature-header-nav-switch.md`: the new switch's `data-active` came back `none` on
`/com_en/blog`.

**Root cause — a wrong belief about `usePathname()`, not a wrong comparison.** The nav's
tests were written as `pathname.startsWith('/category')`, `pathname.startsWith('/blog')`,
`pathname === '/explain'`: app-internal paths, the same shape `href`s are written in. But
`usePathname()` returns the URL **as routed**, and since the locale phase every route is
`/{localizedCatalogCode}/...` — `/com_en/blog`, never `/blog`. Every one of those tests was
therefore permanently false.

It survived unnoticed because `LocaleLink` prefixes the segment on the way *out*, so links
worked perfectly; nothing prefixes it on the way *in*. The failure is also silent by nature —
a missing highlight looks like a styling choice, and the only symptom is the absence of one.
Introduced by `feature-locale-segment-phase2.md`, which did not sweep the readers of
`usePathname()`.

## The fix
`withoutLocale(locale, pathname)` and the `useAppPathname()` hook in
`src/contexts/LocaleContext.tsx`, sitting directly beside `withLocale`/`useLocaleHref` as
their inverse — so the next person writing a route comparison finds it in the file they
already have open. `Header.tsx` reads `useAppPathname()`.

## Behaviour (testable)
- [x] `useAppPathname()` returns `/blog` on `/com_en/blog`, `/` on `/com_en`, and leaves a
      pathname that carries no known locale segment untouched.
- [x] Server-rendered check on the running stack: `data-active="products"` on
      `/com_en/category/cat_2`, `"blog"` on `/com_en/blog` **and** `/fr_fr/blog` (so the fix
      is not hard-coded to one catalog), `"none"` on `/com_en` and `/com_en/cart`.
- [x] `tsc --noEmit` clean; no new dev-server errors on `com_en`, `com_fr`, `fr_fr`, `en_en`.

## Same bug, still present elsewhere (deliberately not fixed here)
`src/components/SearchExplain.tsx` has it too — `pathname === '/search'` and
`pathname.startsWith('/category/')` are both permanently false, so the expert panel's
auto-fetch never fires and `categoryCode` is always empty. It is a two-line fix with
`useAppPathname()`, but it would switch a dormant panel back on, and that is a behaviour
change that wants a real browser to verify; none was available in this session. Left for a
change that can check it.

Other `usePathname()` callers are fine and must stay as they are: `CatalogContext` rewrites
segment 1 and so needs the raw pathname, `ScrollToTop` only uses it as a change key, and
`BlogPage` pushes it back into the router.

## SDK contract used
- None.

## Tracking (required)
- No change.

## MUST NOT change
- **Never compare a raw `usePathname()` against an app-internal path.** Go through
  `useAppPathname()`. This is the exact mistake, and it fails silently.
- `withoutLocale` stays the strict inverse of `withLocale` — leaves non-matching pathnames
  alone rather than stripping the first segment blindly, which would eat `/blog` itself if
  the app were ever mounted without the locale segment.
