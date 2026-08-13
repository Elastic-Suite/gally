'use client';

import { useLayoutEffect, useRef } from 'react';
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

  const localizedCatalogs = selectedCatalog?.localizedCatalogs || [];
  const firstCategory = categories.length > 0 ? categories[0] : null;

  const isActive = (path: string) => pathname === path ? 'active' : '';

  // Which segment of the header switch is on. 'none' is a real state: the homepage, the
  // cart and /explain are inside neither section, and the switch must then show no
  // selection at all rather than lying about one.
  const navSection = pathname.startsWith('/category')
    ? 'products'
    : pathname.startsWith('/blog')
      ? 'blog'
      : 'none';

  // Expose the real rendered header height so the search overlay can offset
  // itself exactly below it, instead of guessing a fixed padding value.
  useLayoutEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${el.offsetHeight}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="header-sticky-group" ref={groupRef}>
      <header className="header">
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

      <div className="header-search-band">
        <div className="header-search-row">
          <SearchBar categories={categories} categoriesLoading={loadingCatalogs} />
        </div>
      </div>
    </div>
  );
}
