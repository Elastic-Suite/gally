import { useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';

export default function Header() {
  const { t } = useTranslation('common');
  const {
    selectedCatalog, selectedLocalizedCatalog,
    setCatalog, setLocalizedCatalog, catalogs, categories, loadingCatalogs,
  } = useCatalog();
  const { itemCount } = useCart();
  const location = useLocation();
  const groupRef = useRef<HTMLDivElement | null>(null);

  const localizedCatalogs = selectedCatalog?.localizedCatalogs || [];
  const firstCategory = categories.length > 0 ? categories[0] : null;

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

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
          <Link to="/" className="header-logo">
            Elastic<span>Suite</span>
          </Link>

          <nav className="header-nav">
            <Link to="/" className={isActive('/')}>{t('nav.home')}</Link>
            <Link
              to={firstCategory ? `/category/${firstCategory.id}` : '/'}
              className={location.pathname.startsWith('/category') ? 'active' : ''}
            >
              {t('nav.categories')}
            </Link>
            <Link to="/explain" className={`expert-only ${isActive('/explain')}`}>{t('nav.searchIntelligence')}</Link>
            <Link to="/cms/about" className={location.pathname.startsWith('/cms') ? 'active' : ''}>{t('nav.cms')}</Link>
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

          <Link to="/cart" className="cart-badge">
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
