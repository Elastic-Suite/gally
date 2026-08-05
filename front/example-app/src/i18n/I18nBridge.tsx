import { useEffect, ReactNode } from 'react';
import i18n from './index';
import { useCatalog } from '../contexts/CatalogContext';

// Translates the catalog's declarative `activeLanguage` into i18next's imperative
// changeLanguage() call — i18next itself isn't a React context, so nothing else
// re-renders when the selected catalog's locale changes without this bridge.
export default function I18nBridge({ children }: { children: ReactNode }) {
  const { activeLanguage } = useCatalog();

  useEffect(() => {
    if (i18n.language !== activeLanguage) {
      i18n.changeLanguage(activeLanguage);
    }
  }, [activeLanguage]);

  return <>{children}</>;
}
