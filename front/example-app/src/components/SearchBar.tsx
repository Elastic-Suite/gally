import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearchBarRef } from '../contexts/SearchBarContext';
import { useAutocomplete } from '../hooks/useSearch';
import SearchOverlay, {
  getSuggestionMatches, getCategoryMatches, getAutocompleteAttributes, attributeFilterUrl,
} from './SearchOverlay';
import { getProductFields } from './ProductCard';

interface SearchBarProps {
  categories: any[];
  categoriesLoading: boolean;
}

export default function SearchBar({ categories, categoriesLoading }: SearchBarProps) {
  const { t } = useTranslation('search');
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const { results, aggregations, loading, search, clear } = useAutocomplete();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchBarRef = useSearchBarRef();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Flattened, in-visual-order list of every navigable item across the 3 columns,
  // so arrow keys can move through them as a single sequence.
  const flatItems = useMemo(() => {
    const items: { key: string; to: string }[] = [];
    getSuggestionMatches(query).forEach(term => {
      items.push({ key: `suggestion-${term}`, to: `/search?q=${encodeURIComponent(term)}` });
    });
    // Attribute options sit under the suggestions in the same column, so they
    // come second in the arrow-key sequence — the order here IS the visual order.
    getAutocompleteAttributes(aggregations).forEach(attr => {
      attr.options.forEach(opt => {
        items.push({
          key: `attribute-${attr.field}-${opt.value}`,
          to: attributeFilterUrl(query, attr.field, opt.value),
        });
      });
    });
    results.forEach((item: any) => {
      const { sku } = getProductFields(item);
      items.push({ key: `product-${sku}`, to: `/product/${encodeURIComponent(sku)}` });
    });
    getCategoryMatches(query, categories).forEach(cat => {
      items.push({ key: `category-${cat.id}`, to: `/category/${cat.id}` });
    });
    return items;
  }, [query, results, aggregations, categories]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  // Keep the highlighted item visible if its column is scrolled.
  useEffect(() => {
    if (highlightedIndex < 0) return;
    const key = flatItems[highlightedIndex]?.key;
    if (!key) return;
    document.querySelector(`[data-item-key="${key}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, flatItems]);

  // Register search bar handle for external control (story companion)
  // The overlay is open for as long as the bar is focused, so anything that ends
  // the search interaction (picking an item, submitting) has to close it
  // explicitly — clearing the query alone would just leave the prompt state up.
  const closeOverlay = () => {
    setFocused(false);
    inputRef.current?.blur();
  };

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
          closeOverlay();
        }
      },
      clear: () => {
        setQuery('');
        clear();
        closeOverlay();
      },
      inputRef,
    };
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      clear();
      closeOverlay();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    search(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      return;
    }
    if (flatItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => (i + 1) % flatItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => (i <= 0 ? flatItems.length - 1 : i - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const item = flatItems[highlightedIndex];
      if (item) {
        navigate(item.to);
        setQuery('');
        clear();
        closeOverlay();
      }
    }
  };

  // Gated on `focused` alone: the overlay opens the moment the bar is focused,
  // even with an empty query — it then shows the "start typing" prompt instead of
  // the three columns. Blurring always closes it, without having to wipe
  // `results`, so refocusing re-opens it instantly with the same suggestions
  // still in place instead of an empty flash.
  const isOverlayOpen = focused;
  const highlightedKey = highlightedIndex >= 0 ? flatItems[highlightedIndex]?.key ?? null : null;

  return (
    <form onSubmit={handleSearch} className={`search-bar-wrapper ${focused ? 'expanded' : ''} ${isOverlayOpen ? 'overlay-open' : ''}`}>
      <span className="search-icon">🔍</span>
      <input
        ref={inputRef}
        type="text"
        className="search-bar"
        placeholder={t('bar.placeholder')}
        value={query}
        onChange={handleInputChange}
        onFocus={() => setFocused(true)}
        // Delayed so a click on an overlay item (a plain div, not a button/link)
        // still registers before the overlay unmounts. Only hides the overlay —
        // `results` is intentionally left alone so refocusing restores it as-is.
        onBlur={() => { setTimeout(() => { setFocused(false); }, 200); }}
        onKeyDown={handleKeyDown}
      />
      <SearchOverlay
        open={isOverlayOpen}
        query={query}
        results={results}
        aggregations={aggregations}
        resultsLoading={loading}
        categories={categories}
        categoriesLoading={categoriesLoading}
        highlightedKey={highlightedKey}
        navigate={navigate}
        setQuery={setQuery}
        clear={clear}
        close={closeOverlay}
      />
    </form>
  );
}
