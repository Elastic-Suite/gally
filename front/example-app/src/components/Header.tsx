import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import { useSearchBarRef } from '../contexts/SearchBarContext';
import { useAutocomplete } from '../hooks/useSearch';
import { getProductFields } from './ProductCard';

// Popular search term suggestions (shown when query partially matches)
const SEARCH_SUGGESTIONS = [
  'dress', 'tank dress', 'summer dress', 'floral dress', 'midi skirt',
  'blouse', 'jacket', 'pants', 'shoes', 'accessories',
];

export default function Header() {
  const {
    selectedCatalog, selectedLocalizedCatalog,
    setCatalog, setLocalizedCatalog, catalogs, currencySymbol, categories,
  } = useCatalog();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const { results, search, clear } = useAutocomplete();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchBarRef = useSearchBarRef();

  // Register search bar handle for external control (story companion)
  useEffect(() => {
    searchBarRef.current = {
      setQuery: (q: string) => {
        setQuery(q);
        search(q);
      },
      submit: () => {
        if (query.trim()) {
          navigate(`/search?q=${encodeURIComponent(query.trim())}`);
          clear();
        }
      },
      clear: () => {
        setQuery('');
        clear();
      },
      inputRef,
    };
  });

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
          <Link to="/explain" className={`expert-only ${isActive('/explain')}`}>Search Intelligence</Link>
          <Link to="/cms/about" className={location.pathname.startsWith('/cms') ? 'active' : ''}>CMS</Link>
        </nav>

        <form onSubmit={handleSearch} className={`search-bar-wrapper ${focused ? 'expanded' : ''}`}>
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="search-bar"
            placeholder="Search products..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setFocused(true)}
            onBlur={() => { setTimeout(() => { clear(); setFocused(false); }, 200); }}
          />
          {(results.length > 0 || (focused && query.length >= 2)) && (
            <div className="autocomplete-dropdown">
              {/* Search term suggestions */}
              {query.length >= 2 && (
                <AutocompleteSuggestions query={query} navigate={navigate} setQuery={setQuery} clear={clear} />
              )}

              {/* Category matches */}
              {query.length >= 2 && (
                <AutocompleteCategories query={query} categories={categories} navigate={navigate} setQuery={setQuery} clear={clear} />
              )}

              {/* Product results */}
              {results.length > 0 && (
                <>
                  <div className="autocomplete-section-title">Products</div>
                  {results.map((item: any, idx: number) => {
                    const { name, sku, price, image } = getProductFields(item);
                    return (
                      <div
                        key={idx}
                        className="autocomplete-item"
                        onClick={() => {
                          navigate(`/product/${encodeURIComponent(sku)}`);
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
                </>
              )}
            </div>
          )}
        </form>

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
          🛒 Cart
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>
      </div>
    </header>
  );
}

// Autocomplete: search term suggestions
function AutocompleteSuggestions({ query, navigate, setQuery, clear }: {
  query: string; navigate: (to: string) => void; setQuery: (q: string) => void; clear: () => void;
}) {
  const matches = SEARCH_SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(query.toLowerCase()) && s.toLowerCase() !== query.toLowerCase()
  ).slice(0, 3);

  if (matches.length === 0) return null;

  return (
    <>
      <div className="autocomplete-section-title">🔍 Search suggestions</div>
      {matches.map(term => (
        <div
          key={term}
          className="autocomplete-item autocomplete-suggestion"
          onClick={() => {
            navigate(`/search?q=${encodeURIComponent(term)}`);
            setQuery('');
            clear();
          }}
        >
          <span className="autocomplete-suggestion-text">{term}</span>
        </div>
      ))}
    </>
  );
}

// Autocomplete: matching categories
function AutocompleteCategories({ query, categories, navigate, setQuery, clear }: {
  query: string; categories: any[]; navigate: (to: string) => void; setQuery: (q: string) => void; clear: () => void;
}) {
  const flatCats: { id: string; name: string }[] = [];
  const flatten = (cats: any[]) => {
    for (const c of cats) {
      flatCats.push({ id: c.id, name: c.name });
      if (c.children) flatten(c.children);
    }
  };
  flatten(categories);

  const matches = flatCats.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  if (matches.length === 0) return null;

  return (
    <>
      <div className="autocomplete-section-title">📁 Categories</div>
      {matches.map(cat => (
        <div
          key={cat.id}
          className="autocomplete-item autocomplete-category"
          onClick={() => {
            navigate(`/category/${cat.id}`);
            setQuery('');
            clear();
          }}
        >
          <span className="autocomplete-category-text">{cat.name}</span>
        </div>
      ))}
    </>
  );
}
