---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Set the i18next language during render, on server and client

## Context and Problem Statement

This decision is older than this ADR. Commit `43f5c64e` (2026-08-07) made it, and
[feature-locale-segment-phase2.md](../../specs/feature-locale-segment-phase2.md) records
it. It replaced the `useEffect` that commit `0b43a059` (2026-08-05) had added.

`I18nBridge` turns the catalog's language into an `i18n.changeLanguage()` call. It used to
make that call in a `useEffect`. Once the URL carried the catalog code, the server knew the
language, but an effect only runs on the client, after hydration. For a `com_fr` URL the
server sent English, and the client switched to French a moment later. Every translated
string on the page was a hydration mismatch.

Where should the language be set so both sides render the same text?

## Decision Drivers

-   The server and the first client render must produce the same language.
-   A crawler, or a visitor with JavaScript off, must get the page in the URL's language.

## Considered Options

No alternative was recorded. The spec names a per-request i18next instance as the real fix
for the caveat below, not as an option that was weighed.

## Decision Outcome

`I18nBridge` calls `changeLanguage()` during render, on both server and client. All locale
resources are bundled in `src/i18n/index.ts`, so the call applies at once and the first
render is already in the right language.

### Consequences

-   Good, because there is no hydration mismatch, and no flash of English on French pages.
-   Bad, because i18next is a module singleton. On the server it is shared across concurrent
    requests, so two requests for different languages at the same moment could mix. This is
    accepted for a demo.
-   Bad, because all languages ship in the bundle. Loading them on demand would make the call
    asynchronous and bring the mismatch back.

### Confirmation

-   `grep -n changeLanguage src/i18n/I18nBridge.tsx` shows the call in the component body,
    not inside a `useEffect`.
-   `curl -s https://gally.localhost/example/com_fr/cart` contains "Votre Panier".

## More Information

If this storefront ever serves real traffic, replace the singleton with one i18next instance
per request.
