'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from './LocaleLink';
import { useTranslation } from 'react-i18next';
import { useAppPathname } from '../contexts/LocaleContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';
import CategoryNav from './CategoryNav';
import BrandLockup from './BrandLockup';
import SectionLinks from './SectionLinks';

export default function Header() {
  const { t } = useTranslation('common');
  const {
    selectedCatalog, selectedLocalizedCatalog,
    setCatalog, setLocalizedCatalog, catalogs, categories, loadingCatalogs,
  } = useCatalog();
  const { itemCount } = useCart();
  // Locale-free: usePathname() would return `/com_en/blog`. The section links' active state
  // lives in SectionLinks now; this one only picks the route without a search band.
  const pathname = useAppPathname();
  const groupRef = useRef<HTMLDivElement | null>(null);

  const localizedCatalogs = selectedCatalog?.localizedCatalogs || [];

  // /vector-search is the one route that supplies its own search input. See the band below.
  const hideSearchBand = pathname === '/vector-search';


  // Expose the real rendered height of the whole group as --header-height, so CSS can offset
  // against it instead of guessing: it is the search overlay's top padding. Measured, because
  // it changes with viewport width: both header rows wrap on mobile.
  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${group.offsetHeight}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="header-sticky-group" ref={groupRef}>
      <header className="header">
        <div className="header-inner">
          <BrandLockup />
          <SectionLinks className="header-nav" />

          <div className="context-selectors">
            <select
              className="context-select"
              value={selectedCatalog?.code || ''}
              onChange={e => setCatalog(e.target.value)}
            >
              {catalogs.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            <select
              className="context-select"
              value={selectedLocalizedCatalog?.code || ''}
              onChange={e => setLocalizedCatalog(e.target.value)}
            >
              {localizedCatalogs.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Icon only on screen; the label stays in the accessible name as visually hidden
              text rather than aria-label, so the count after it is announced too. */}
          <Link href="/cart" className="cart-badge">
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2.5 3h2.2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.9a1.5 1.5 0 0 0 1.5-1.1L21 7H6" />
            </svg>
            <span className="visually-hidden">{t('cart.link')}</span>
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>

        {/* The category row is part of the header since specs/feature-header-light-two-row.md:
            here in the app shell it is outside <main>, so no navigation ever swaps it out. It is
            inside <header> on purpose, so the two rows share one surface. */}
        <CategoryNav />
      </header>

      {/* The band is omitted on /vector-search ONLY. That page carries its own full-width
          search box which IS the page, so the header's bar was a second search input above it
          doing something different (it navigates to /search and abandons the comparison) —
          confusing, and it cost ~90px of vertical space on the longest page in the app.
          Route-scoped rather than CSS-hidden so the SearchBar and its overlay are not mounted
          at all. Two things that would otherwise break, both checked:
          - `--header-height` is MEASURED by the ResizeObserver above, not a constant, so it
            re-publishes the shorter height on its own.
          - `SearchBarProvider` lives in app/providers.tsx, so `useSearchBarRef()` still
            resolves; only `ref.current` is null. Its one consumer outside SearchBar is
            useStoryActions' `type_and_search`, which already guards with `if (!handle) return`
            and navigates to its own startRoute first — so the guided story is unaffected. */}
      {!hideSearchBand && (
        <div className="header-search-band">
          <div className="header-search-row">
            <SearchBar categories={categories} categoriesLoading={loadingCatalogs} />
          </div>
        </div>
      )}
    </div>
  );
}
