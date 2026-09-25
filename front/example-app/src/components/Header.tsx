'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
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
  const navRef = useRef<HTMLElement | null>(null);

  const localizedCatalogs = selectedCatalog?.localizedCatalogs || [];

  // /vector-search is the one route that supplies its own search input. See the band below.
  const hideSearchBand = pathname === '/vector-search';


  // Expose the real rendered heights so CSS can offset against them instead of guessing:
  //  --header-height     the whole group — the search overlay's top padding.
  //  --header-nav-height the <header> — logo row AND category row — which is how far the group
  //                      is pulled up when it sticks, so both rows scroll out of view and the
  //                      search band lands at the viewport top. See .header-sticky-group.
  // Both are measured, because both change with viewport width: both rows wrap on mobile.
  useLayoutEffect(() => {
    const group = groupRef.current;
    const nav = navRef.current;
    if (!group || !nav) return;
    const updateHeights = () => {
      const style = document.documentElement.style;
      style.setProperty('--header-height', `${group.offsetHeight}px`);
      style.setProperty('--header-nav-height', `${nav.offsetHeight}px`);
    };
    updateHeights();
    const observer = new ResizeObserver(updateHeights);
    observer.observe(group);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  // Flag "the page has scrolled" on the group. The blurred layer around the search bar keys off
  // it (styles.css, .search-bar-wrapper::before): at rest the bar sits on the page background
  // and has nothing to separate from. The threshold is the <header>'s own height — the exact
  // point at which the group has slid far enough that the band is the topmost row and content
  // starts passing behind the bar.
  //
  // An attribute rather than a CSS variable: it is a binary state, and CSS can then add the
  // :not(:has(.overlay-open)) condition itself instead of this component knowing about the ACP.
  // Passive + rAF-coalesced, since scroll fires far more often than the compositor paints, and
  // read once on mount because a back-navigation can restore a scrolled position without ever
  // firing a scroll event.
  useEffect(() => {
    const group = groupRef.current;
    const nav = navRef.current;
    if (!group || !nav) return;
    let frame: number | null = null;
    const sync = () => {
      frame = null;
      group.toggleAttribute('data-scrolled', window.scrollY > nav.offsetHeight);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="header-sticky-group" ref={groupRef}>
      <header className="header" ref={navRef}>
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
            inside <header> on purpose — navRef measures both rows, so the sticky group pulls both
            above the fold and the search band still lands at the viewport top. */}
        <CategoryNav />
      </header>

      {/* The band is omitted on /vector-search ONLY. That page carries its own full-width
          search box which IS the page, so the header's bar was a second search input above it
          doing something different (it navigates to /search and abandons the comparison) —
          confusing, and it cost ~90px of vertical space on the longest page in the app.
          Route-scoped rather than CSS-hidden so the SearchBar and its overlay are not mounted
          at all. Two things that would otherwise break, both checked:
          - `--header-height` / `--header-nav-height` are MEASURED by the ResizeObserver above,
            not constants, so they re-publish the shorter height on their own.
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
