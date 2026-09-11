'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
    ICatalog, ILocalizedCatalog, ICategoryNode, LANGUAGES, DEFAULT_LANGUAGE,
} from '../sdk/catalogs';
import { useNavigate } from './NavigationContext';

interface ICatalogContextType {
  catalogs: ICatalog[];
  selectedCatalog: ICatalog | null;
  selectedLocalizedCatalog: ILocalizedCatalog | null;
  setCatalog: (code: string) => void;
  setLocalizedCatalog: (code: string) => void;
  formatPrice: (amount: number) => string;
  activeLanguage: string;
  categories: ICategoryNode[];
  loadingCatalogs: boolean;
}

const CatalogContext = createContext<ICatalogContextType | null>(null);

// Phase 2 inverted this provider. It used to OWN the selection: mount with nothing,
// fetch the catalog list in a useEffect, pick a default, hold it in useState. Now the
// URL owns it — app/[locale]/layout.tsx resolves the segment on the server and passes
// the answer down, and selecting a catalog is a navigation.
//
// Nothing here is held in useState on purpose. Next reuses this layout instance across
// locale changes, so seeded state would silently go stale the moment you switched
// catalog. Deriving straight from props keeps the URL and the UI incapable of
// disagreeing.
export function CatalogProvider({
  catalogs,
  selectedCatalog,
  selectedLocalizedCatalog,
  categories,
  children,
}: {
  catalogs: ICatalog[];
  selectedCatalog: ICatalog;
  selectedLocalizedCatalog: ILocalizedCatalog;
  categories: ICategoryNode[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  // Not router.push: a catalog switch re-resolves the catalog list, the category tree AND the
  // page's own data on the server, so it is the slowest navigation in the app — exactly the
  // one that must not look like nothing happened. See src/contexts/NavigationContext.tsx.
  const navigate = useNavigate();

  // Swap the locale segment while staying on the same page, so switching catalog from a
  // product page keeps you on that product rather than dumping you on the homepage.
  const goToLocalizedCatalog = useCallback((code: string) => {
    const segments = pathname.split('/');
    const previous = segments[1];
    segments[1] = code;
    const target = segments.join('/') || '/';
    // Category and product are the two routes whose URL names a per-catalog id, so they are the
    // two that can miss in the target catalog and 404. The mark tells those routes that this was
    // a catalog switch and not a junk URL, so they redirect to the new catalog's listing instead
    // of leaving the visitor on a dead end — see src/sdk/catalogSwitch.ts. Everything else exists
    // in every catalog and keeps a clean URL.
    const canMiss = segments[2] === 'category' || segments[2] === 'product';
    navigate(canMiss ? `${target}?from=${previous}` : target);
  }, [pathname, navigate]);

  const setLocalizedCatalog = goToLocalizedCatalog;

  const setCatalog = useCallback((code: string) => {
    const cat = catalogs.find(c => c.code === code);
    if (!cat) return;
    const defaultLC = cat.localizedCatalogs.find(lc => lc.isDefault) || cat.localizedCatalogs[0];
    if (defaultLC) goToLocalizedCatalog(defaultLC.code);
  }, [catalogs, goToLocalizedCatalog]);

  const activeLanguage = LANGUAGES[selectedLocalizedCatalog.locale] || DEFAULT_LANGUAGE;

  const formatPrice = useCallback((amount: number) => {
    return new Intl.NumberFormat(selectedLocalizedCatalog.locale.replace('_', '-'), {
      style: 'currency',
      currency: selectedLocalizedCatalog.currency,
    }).format(amount);
  }, [selectedLocalizedCatalog]);

  return (
    <CatalogContext.Provider value={{
      catalogs,
      selectedCatalog,
      selectedLocalizedCatalog,
      setCatalog,
      setLocalizedCatalog,
      formatPrice,
      activeLanguage,
      categories,
      // The catalog list is resolved before render now, so consumers that used this to
      // show a spinner simply never see a loading state. Kept so their call sites and
      // their empty-state branches stay untouched.
      loadingCatalogs: false,
    }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider');
  return ctx;
}
