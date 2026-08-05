import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useCatalog } from '../contexts/CatalogContext';
import { getProductFields } from './ProductCard';

// getSuggestionMatches is a plain (non-hook) function shared with SearchBar.tsx's
// keyboard-nav list, so it reads the active language straight off the i18next
// singleton rather than via useTranslation().
export function getSuggestionMatches(query: string): string[] {
  if (query.length < 2) return [];
  const suggestions = i18n.t('search:overlay.suggestions', { returnObjects: true }) as string[];
  return suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase()) && s.toLowerCase() !== query.toLowerCase()
  ).slice(0, 3);
}

export function getCategoryMatches(query: string, categories: any[]): { id: string; name: string }[] {
  if (query.length < 2) return [];
  const flatCats: { id: string; name: string }[] = [];
  const flatten = (cats: any[]) => {
    for (const c of cats) {
      flatCats.push({ id: c.id, name: c.name });
      if (c.children) flatten(c.children);
    }
  };
  flatten(categories);
  return flatCats.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
}

interface SearchOverlayProps {
  open: boolean;
  query: string;
  results: any[];
  resultsLoading: boolean;
  categories: any[];
  categoriesLoading: boolean;
  highlightedKey: string | null;
  navigate: (to: string) => void;
  setQuery: (q: string) => void;
  clear: () => void;
}

export default function SearchOverlay({
  open, query, results, resultsLoading, categories, categoriesLoading, highlightedKey, navigate, setQuery, clear,
}: SearchOverlayProps) {
  if (!open) return null;

  const closeAndGo = (to: string) => {
    navigate(to);
    setQuery('');
    clear();
  };

  return createPortal(
    <div className="search-overlay-scrim">
      <div className="search-overlay-panel">
        <div className="search-overlay-col">
          <SuggestionsColumn query={query} highlightedKey={highlightedKey} onSelect={closeAndGo} />
        </div>
        <div className="search-overlay-col">
          <ProductsColumn
            results={results}
            loading={resultsLoading}
            highlightedKey={highlightedKey}
            onSelect={closeAndGo}
          />
        </div>
        <div className="search-overlay-col">
          <CategoriesColumn
            query={query}
            categories={categories}
            loading={categoriesLoading}
            highlightedKey={highlightedKey}
            onSelect={closeAndGo}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

function SkeletonRows({ withThumb, count = 3 }: { withThumb?: boolean; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div className={`autocomplete-skeleton-item ${withThumb ? 'autocomplete-skeleton-product' : ''}`} key={i}>
          {withThumb && <div className="autocomplete-skeleton-thumb skeleton-shimmer" />}
          <div className="autocomplete-skeleton-lines">
            <div className="autocomplete-skeleton-line skeleton-shimmer" />
            <div className="autocomplete-skeleton-line skeleton-shimmer short" />
          </div>
        </div>
      ))}
    </>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <div className="autocomplete-empty">{text}</div>;
}

// Column: popular search term suggestions
function SuggestionsColumn({ query, highlightedKey, onSelect }: {
  query: string; highlightedKey: string | null; onSelect: (to: string) => void;
}) {
  const { t } = useTranslation('search');
  const matches = getSuggestionMatches(query);

  return (
    <>
      <div className="autocomplete-section-title">{t('overlay.suggestionsTitle')}</div>
      {matches.length === 0 ? (
        <EmptyNote text={t('overlay.noSuggestions')} />
      ) : (
        matches.map(term => {
          const key = `suggestion-${term}`;
          return (
            <div
              key={term}
              data-item-key={key}
              className={`autocomplete-item autocomplete-suggestion ${key === highlightedKey ? 'highlighted' : ''}`}
              onClick={() => onSelect(`/search?q=${encodeURIComponent(term)}`)}
            >
              <span className="autocomplete-suggestion-text">{term}</span>
            </div>
          );
        })
      )}
    </>
  );
}

// Column: matching products (real API results, debounced)
function ProductsColumn({ results, loading, highlightedKey, onSelect }: {
  results: any[]; loading: boolean; highlightedKey: string | null; onSelect: (to: string) => void;
}) {
  const { t } = useTranslation('search');
  const { formatPrice } = useCatalog();
  return (
    <>
      <div className="autocomplete-section-title">{t('overlay.productsTitle')}</div>
      {loading ? (
        <div className="autocomplete-products-grid">
          <SkeletonRows withThumb />
        </div>
      ) : results.length === 0 ? (
        <EmptyNote text={t('overlay.noProducts')} />
      ) : (
        <div className="autocomplete-products-grid">
          {results.map((item: any, idx: number) => {
            const { name, sku, price, image } = getProductFields(item);
            const key = `product-${sku}`;
            return (
              <div
                key={idx}
                data-item-key={key}
                className={`autocomplete-item autocomplete-product ${key === highlightedKey ? 'highlighted' : ''}`}
                onClick={() => onSelect(`/product/${encodeURIComponent(sku)}`)}
              >
                <div className="autocomplete-thumb">
                  {image ? <img src={image} alt={name} style={{ width: 80, height: 80, objectFit: 'contain' }} /> : 'IMG'}
                </div>
                <div className="autocomplete-info">
                  <div className="name">{name}</div>
                  <div className="price">{formatPrice(price)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// Column: matching categories
function CategoriesColumn({ query, categories, loading, highlightedKey, onSelect }: {
  query: string; categories: any[]; loading: boolean; highlightedKey: string | null; onSelect: (to: string) => void;
}) {
  const { t } = useTranslation('search');
  const matches = getCategoryMatches(query, categories);

  return (
    <>
      <div className="autocomplete-section-title">{t('overlay.categoryTitle')}</div>
      {loading ? (
        <SkeletonRows />
      ) : matches.length === 0 ? (
        <EmptyNote text={t('overlay.noCategories')} />
      ) : (
        matches.map(cat => {
          const key = `category-${cat.id}`;
          return (
            <div
              key={cat.id}
              data-item-key={key}
              className={`autocomplete-item autocomplete-category ${key === highlightedKey ? 'highlighted' : ''}`}
              onClick={() => onSelect(`/category/${cat.id}`)}
            >
              <span className="autocomplete-category-text">{cat.name}</span>
            </div>
          );
        })
      )}
    </>
  );
}
