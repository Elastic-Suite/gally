import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
    fetchCatalogs, fetchCategoryTree,
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

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalogs, setCatalogs] = useState<ICatalog[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<ICatalog | null>(null);
  const [selectedLocalizedCatalog, setSelectedLocalizedCatalog] = useState<ILocalizedCatalog | null>(null);
  const [categories, setCategories] = useState<ICategoryNode[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  // Fetch catalogs on mount
  useEffect(() => {
    fetchCatalogs()
      .then(cats => {
        setCatalogs(cats);
        if (cats.length > 0) {
          const first = cats[0];
          setSelectedCatalog(first);
          const defaultLC = first.localizedCatalogs.find(lc => lc.isDefault) || first.localizedCatalogs[0];
          if (defaultLC) setSelectedLocalizedCatalog(defaultLC);
        }
      })
      .catch(err => console.error('Failed to fetch catalogs:', err))
      .finally(() => setLoadingCatalogs(false));
  }, []);

  // Fetch category tree when localized catalog changes
  useEffect(() => {
    if (selectedCatalog && selectedLocalizedCatalog) {
      fetchCategoryTree(selectedCatalog.id, selectedLocalizedCatalog.id)
        .then(setCategories)
        .catch(err => console.error('Failed to fetch categories:', err));
    }
  }, [selectedCatalog, selectedLocalizedCatalog]);

  const setCatalog = useCallback((code: string) => {
    const cat = catalogs.find(c => c.code === code);
    if (cat) {
      setSelectedCatalog(cat);
      const defaultLC = cat.localizedCatalogs.find(lc => lc.isDefault) || cat.localizedCatalogs[0];
      if (defaultLC) setSelectedLocalizedCatalog(defaultLC);
    }
  }, [catalogs]);

  const setLocalizedCatalog = useCallback((code: string) => {
    const allLC = catalogs.flatMap(c => c.localizedCatalogs);
    const lc = allLC.find(l => l.code === code);
    if (lc) setSelectedLocalizedCatalog(lc);
  }, [catalogs]);

  const activeLanguage = selectedLocalizedCatalog
    ? LANGUAGES[selectedLocalizedCatalog.locale] || DEFAULT_LANGUAGE
    : DEFAULT_LANGUAGE;

  const formatPrice = useCallback((amount: number) => {
    if (!selectedLocalizedCatalog) return `€${amount.toFixed(2)}`;
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
      loadingCatalogs,
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
