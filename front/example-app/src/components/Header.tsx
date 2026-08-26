'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Link from './LocaleLink';
import { useTranslation } from 'react-i18next';
import { useAppPathname } from '../contexts/LocaleContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import brandMark from '../assets/gally-rabbit.svg';
import SearchBar from './SearchBar';

export default function Header() {
  const { t } = useTranslation('common');
  const {
    selectedCatalog, selectedLocalizedCatalog,
    setCatalog, setLocalizedCatalog, catalogs, categories, loadingCatalogs,
  } = useCatalog();
  const { itemCount } = useCart();
  // Locale-free: usePathname() would return `/com_en/blog`, against which every route
  // test below is false. That is what had silently killed the nav's active state.
  const pathname = useAppPathname();
  const groupRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const localizedCatalogs = selectedCatalog?.localizedCatalogs || [];
  const firstCategory = categories.length > 0 ? categories[0] : null;

  const isActive = (path: string) => pathname === path ? 'active' : '';

  // /vector-search is the one route that supplies its own search input. See the band below.
  const hideSearchBand = pathname === '/vector-search';

  // Which segment of the header switch is on. 'none' is a real state: the homepage, the
  // cart and /explain are inside neither section, and the switch must then show no
  // selection at all rather than lying about one.
  const navSection = pathname.startsWith('/category')
    ? 'products'
    : pathname.startsWith('/blog')
      ? 'blog'
      : 'none';

  // Expose the real rendered heights so CSS can offset against them instead of guessing:
  //  --header-height     the whole group — the search overlay's top padding.
  //  --header-nav-height just the nav row — how far the group is pulled up when it sticks, so
  //                      the nav scrolls out of view and the search band lands at the viewport
  //                      top. See .header-sticky-group in styles.css.
  // Both are measured, because both change with viewport width: the nav row wraps on mobile.
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
  // and has nothing to separate from. The threshold is the nav row's own height — the exact
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
          {/* Mark + wordmark: the asset is the rabbit alone, so the "Gally example" type
              is set here. The words are a brand name, not copy — never translated. Both
              spans are aria-hidden with the accessible name on the link, so the lockup is
              announced once rather than as mark + two words. */}
          <Link href="/" className="header-logo" aria-label={t('brand.ariaLabel')}>
            {/* CRA resolved an SVG import to a URL string; Next resolves it to a
                StaticImageData object, so the URL now lives on .src */}
            <img src={brandMark.src} alt="" className="header-logo-mark" />
            <span className="header-logo-text" aria-hidden="true">
              <span className="header-logo-name">Gally</span>
              <span className="header-logo-accent">example</span>
            </span>
          </Link>

          {/* No Home item — the brand lockup above is the link to `/`. */}
          <nav className="header-nav">
            {/* Products and Articles are the two storefront destinations, so they read as
                one segmented switch — the same idiom as the search results type switch,
                inverted for the dark bar. data-active drives the sliding thumb in CSS;
                'none' parks it and fades it out on every other route. See
                .header-nav-switch::before. Search Intelligence stays a plain link outside
                the switch: it is an expert-mode tool, not a third storefront section. */}
            <div className="header-nav-switch" data-active={navSection}>
              <Link
                href={firstCategory ? `/category/${firstCategory.id}` : '/'}
                className={`header-nav-tab ${navSection === 'products' ? 'active' : ''}`}
                aria-current={navSection === 'products' ? 'page' : undefined}
              >
                <span className="header-nav-icon" aria-hidden="true">🛍️</span>
                {t('nav.products')}
              </Link>
              <Link
                href="/blog"
                className={`header-nav-tab ${navSection === 'blog' ? 'active' : ''}`}
                aria-current={navSection === 'blog' ? 'page' : undefined}
              >
                <span className="header-nav-icon" aria-hidden="true">📰</span>
                {t('nav.cms')}
              </Link>
            </div>
            <Link href="/explain" className={`expert-only ${isActive('/explain')}`}>{t('nav.searchIntelligence')}</Link>
            {/* Deliberately NOT `expert-only`, unlike /explain beside it: that class is
                display:none under the default `direction` audience mode (see .mode-direction
                .expert-only), which is why this link was invisible when it first shipped. The
                comparison is the thing this demo is for, so it is always reachable.
                Also deliberately outside .header-nav-switch: that switch is a two-way
                Products/Articles control with a sliding thumb sized `1fr 1fr`, and this is not
                a third storefront section. */}
            <Link
              href="/vector-search"
              className={isActive('/vector-search')}
              aria-current={pathname === '/vector-search' ? 'page' : undefined}
            >
              <span className="header-nav-icon" aria-hidden="true">✨</span>
              {t('nav.vectorSearch')}
            </Link>
          </nav>

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

          <Link href="/cart" className="cart-badge">
            🛒 {t('cart.link')}
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>
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
