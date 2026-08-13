'use client';

import React from 'react';
import { CatalogProvider } from '../src/contexts/CatalogContext';
import { CartProvider } from '../src/contexts/CartContext';
import { DemoProvider } from '../src/contexts/DemoContext';
import { SearchBarProvider } from '../src/contexts/SearchBarContext';
import { LocaleProvider } from '../src/contexts/LocaleContext';
import { NavigationProvider } from '../src/contexts/NavigationContext';
import I18nBridge from '../src/i18n/I18nBridge';
import AppShell from '../src/components/AppShell';
import { ICatalog, ILocalizedCatalog, ICategoryNode } from '../src/sdk/catalogs';
import '../src/i18n';

// The provider tree, in the order the CRA src/index.tsx used, with LocaleProvider added
// outermost so anything below can build locale-prefixed hrefs. Everything the catalog
// layer needs now arrives as props resolved on the server — CatalogProvider no longer
// discovers it in a useEffect after mount.
export default function Providers({
  locale,
  catalogs,
  selectedCatalog,
  selectedLocalizedCatalog,
  categories,
  children,
}: {
  locale: string;
  catalogs: ICatalog[];
  selectedCatalog: ICatalog;
  selectedLocalizedCatalog: ILocalizedCatalog;
  categories: ICategoryNode[];
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider locale={locale}>
      {/* Above CatalogProvider because LocaleLink — which every link in the app is — reports
          into it, and links exist in the header, the nav and every page. */}
      <NavigationProvider>
        <CatalogProvider
          catalogs={catalogs}
          selectedCatalog={selectedCatalog}
          selectedLocalizedCatalog={selectedLocalizedCatalog}
          categories={categories}
        >
          <I18nBridge>
            <CartProvider>
              <DemoProvider>
                <SearchBarProvider>
                  <AppShell>{children}</AppShell>
                </SearchBarProvider>
              </DemoProvider>
            </CartProvider>
          </I18nBridge>
        </CatalogProvider>
      </NavigationProvider>
    </LocaleProvider>
  );
}
