import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import { useAutocomplete } from '../hooks/useSearch';
import { getProductFields } from './ProductCard';

export default function Header() {
  const {
    selectedCatalog, selectedLocalizedCatalog,
    setCatalog, setLocalizedCatalog, catalogs, currencySymbol, categories,
  } = useCatalog();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const { results, search, clear } = useAutocomplete();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      clear();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    search(val);
  };

  const localizedCatalogs = selectedCatalog?.localizedCatalogs || [];
  const firstCategory = categories.length > 0 ? categories[0] : null;

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          Elastic<span>Suite</span>
        </Link>

        <nav className="header-nav">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link
            to={firstCategory ? `/category/${firstCategory.id}` : '/'}
            className={location.pathname.startsWith('/category') ? 'active' : ''}
          >
            Categories
          </Link>
          <Link to="/search?q=" className={location.pathname === '/search' ? 'active' : ''}>Search</Link>
          <Link to="/vector-search" className={isActive('/vector-search')}>Vector Search</Link>
          <Link to="/cms/about" className={location.pathname.startsWith('/cms') ? 'active' : ''}>CMS</Link>
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

        <form onSubmit={handleSearch} className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-bar"
            placeholder="Search products..."
            value={query}
            onChange={handleInputChange}
            onBlur={() => setTimeout(clear, 200)}
          />
          {results.length > 0 && (
            <div className="autocomplete-dropdown">
              {results.map((item: any, idx: number) => {
                const { name, sku, price, image } = getProductFields(item);
                return (
                  <div
                    key={idx}
                    className="autocomplete-item"
                    onClick={() => {
                      navigate(`/product/${sku}`);
                      setQuery('');
                      clear();
                    }}
                  >
                    <div className="autocomplete-thumb">
                      {image ? <img src={image} alt={name} style={{ width: 40, height: 40, objectFit: 'contain' }} /> : 'IMG'}
                    </div>
                    <div className="autocomplete-info">
                      <div className="name">{name}</div>
                      <div className="price">{currencySymbol}{price}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </form>

        <Link to="/cart" className="cart-badge">
          🛒 Cart
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>
      </div>
    </header>
  );
}
