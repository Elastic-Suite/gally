'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    ICatalog, ILocalizedCatalog, ICategoryNode, LANGUAGES, DEFAULT_LANGUAGE,
} from '../sdk/catalogs';

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
  const router = useRouter();
  const pathname = usePathname();

  // Swap the locale segment while staying on the same page, so switching catalog from a
  // product page keeps you on that product rather than dumping you on the homepage.
  const goToLocalizedCatalog = useCallback((code: string) => {
    const segments = pathname.split('/');
    segments[1] = code;
    router.push(segments.join('/') || '/');
  }, [pathname, router]);

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
