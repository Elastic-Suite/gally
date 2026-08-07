'use client';

import { ReactNode } from 'react';
import i18n from './index';
import { useCatalog } from '../contexts/CatalogContext';

// Translates the catalog's declarative `activeLanguage` into i18next's imperative
// changeLanguage() call — i18next itself isn't a React context, so nothing else
// re-renders when the selected catalog's locale changes without this bridge.
//
// This runs DURING RENDER, not in a useEffect, and that is deliberate. An effect only
// fires on the client after hydration, so the server would emit English for a `com_fr`
// URL and the client would swap to French a moment later — a hydration mismatch on
// every translated string on the page. All locale resources are bundled statically in
// ./index, so changeLanguage() applies synchronously and both sides render the same
// language on the first pass.
//
// Caveat worth knowing: i18next is a module singleton, so on the server it is shared
// across concurrent requests. Two requests for different locales rendering at the exact
// same moment could interleave. Acceptable for a demo; a per-request i18next instance
// is the real fix if this ever serves meaningful traffic.
export default function I18nBridge({ children }: { children: ReactNode }) {
  const { activeLanguage } = useCatalog();

  if (i18n.language !== activeLanguage) {
    i18n.changeLanguage(activeLanguage);
  }

  return <>{children}</>;
}
