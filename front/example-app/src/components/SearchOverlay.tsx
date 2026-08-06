import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
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

export interface AcpAttribute {
  field: string;
  label: string;
  options: { value: string; label: string; count: number }[];
}

// `name` is a text source field: its buckets are whole product names, which reads
// as a broken duplicate of the Products column rather than a filter. Same call as
// Facets.tsx's IGNORED_FACETS, for the same reason.
const IGNORED_ACP_ATTRIBUTES = ['name'];
const MAX_ACP_OPTIONS = 5;

// The backend already decided *which* attributes appear here (source fields flagged
// "Displayed in autocomplete") and how many options each returns
// (gally.autocomplete_settings.*_attribute.max_size). This only drops what can't be
// rendered as a clickable filter and caps the column height.
export function getAutocompleteAttributes(aggregations: any[]): AcpAttribute[] {
  return (aggregations ?? [])
    .filter(agg => !IGNORED_ACP_ATTRIBUTES.includes(agg.field))
    // Sliders have no discrete options to click; anything empty has nothing to show.
    .filter(agg => agg.type !== 'slider' && (agg.options?.length ?? 0) > 0)
    .map(agg => ({
      field: agg.field,
      label: agg.label || agg.field,
      options: agg.options.slice(0, MAX_ACP_OPTIONS),
    }));
}

// Filters travel to the search page as repeatable `f_<field>=<value>` params —
// SearchPage seeds its activeFilters from them (arrays, so the facet sidebar shows
// the value as checked and the active-filter chip renders).
export function attributeFilterUrl(query: string, field: string, value: string): string {
  return `/search?q=${encodeURIComponent(query.trim())}&f_${encodeURIComponent(field)}=${encodeURIComponent(value)}`;
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
  aggregations: any[];
  resultsLoading: boolean;
  categories: any[];
  categoriesLoading: boolean;
  highlightedKey: string | null;
  navigate: (to: string) => void;
  setQuery: (q: string) => void;
  clear: () => void;
  close: () => void;
}

export default function SearchOverlay({
  open, query, results, aggregations, resultsLoading, categories, categoriesLoading, highlightedKey, navigate, setQuery, clear, close,
}: SearchOverlayProps) {
  if (!open) return null;

  const closeAndGo = (to: string) => {
    navigate(to);
    setQuery('');
    clear();
    close();
  };

  // Below the 2-char autocomplete threshold nothing can match yet, so the three
  // columns would only render three "no match" notes. Show the invitation instead.
  if (query.trim().length < 2) {
    return createPortal(
      <div className="search-overlay-scrim">
        <div className="search-overlay-panel search-overlay-panel-prompt">
          <SearchPrompt />
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="search-overlay-scrim">
      <div className="search-overlay-panel">
        <div className="search-overlay-col">
          <SuggestionsColumn query={query} highlightedKey={highlightedKey} onSelect={closeAndGo} />
          <AttributesSections
            query={query}
            aggregations={aggregations}
            highlightedKey={highlightedKey}
            onSelect={closeAndGo}
          />
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

// Shown while the field is focused but still (almost) empty — the overlay is
// open, so it needs to say something rather than sit there as a blank slab.
function SearchPrompt() {
  const { t } = useTranslation('search');
  return (
    <div className="search-prompt">
      <div className="search-prompt-icon">🔍</div>
      <div className="search-prompt-title">{t('overlay.promptTitle')}</div>
      <div className="search-prompt-subtitle">{t('overlay.promptSubtitle')}</div>
    </div>
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

// Stacked under the popular search terms, in the same column: one section per
// attribute the merchandiser flagged "Displayed in autocomplete". Section titles
// are the API's own localized `label`, so nothing here needs translating.
function AttributesSections({ query, aggregations, highlightedKey, onSelect }: {
  query: string; aggregations: any[]; highlightedKey: string | null; onSelect: (to: string) => void;
}) {
  const attributes = getAutocompleteAttributes(aggregations);
  if (attributes.length === 0) return null;

  return (
    <>
      {attributes.map(attr => (
        <div className="autocomplete-attribute-group" key={attr.field}>
          <div className="autocomplete-section-title">{attr.label}</div>
          {attr.options.map(opt => {
            const key = `attribute-${attr.field}-${opt.value}`;
            return (
              <div
                key={opt.value}
                data-item-key={key}
                className={`autocomplete-item autocomplete-attribute ${key === highlightedKey ? 'highlighted' : ''}`}
                onClick={() => onSelect(attributeFilterUrl(query, attr.field, opt.value))}
              >
                <span className="autocomplete-attribute-text">{opt.label}</span>
                <span className="autocomplete-attribute-count">{opt.count}</span>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

// Column: matching products (real API results, debounced)
function ProductsColumn({ results, loading, highlightedKey, onSelect }: {
  results: any[]; loading: boolean; highlightedKey: string | null; onSelect: (to: string) => void;
}) {
  const { t } = useTranslation(['search', 'product']);
  const { formatPrice } = useCatalog();
  const { addToCart } = useCart();

  // The header (and its cart badge) is blurred and dimmed while the ACP is open,
  // so an add has to confirm itself in place: the card flashes green and the
  // button flips to "Added" for a moment before returning to its normal label.
  const [addedSku, setAddedSku] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const handleAdd = (item: { sku: string; name: string; price: number; image: string }) => {
    addToCart({ ...item, childSku: item.sku });
    setAddedSku(item.sku);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAddedSku(null), 1600);
  };

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
            const { name, sku, price, image, stock } = getProductFields(item);
            const key = `product-${sku}`;
            const justAdded = addedSku === sku;
            return (
              <div
                key={idx}
                data-item-key={key}
                className={`autocomplete-item autocomplete-product ${key === highlightedKey ? 'highlighted' : ''} ${justAdded ? 'just-added' : ''}`}
                onClick={() => onSelect(`/product/${encodeURIComponent(sku)}`)}
              >
                <div className="autocomplete-thumb">
                  {image ? <img src={image} alt={name} style={{ width: 80, height: 80, objectFit: 'contain' }} /> : 'IMG'}
                </div>
                <div className="autocomplete-info">
                  <div className="name">{name}</div>
                  <div className="price">{formatPrice(price)}</div>
                </div>
                <button
                  type="button"
                  className={`btn btn-coral btn-sm autocomplete-add-to-cart ${justAdded ? 'added' : ''}`}
                  disabled={!stock.status}
                  // The whole card navigates to the product; adding to cart must not.
                  // preventDefault on mousedown keeps focus on the search input (the
                  // click still fires), so the ACP stays open and you can add several
                  // products in a row instead of it closing on the first blur.
                  onMouseDown={e => e.preventDefault()}
                  onClick={e => {
                    e.stopPropagation();
                    handleAdd({ sku, name, price, image });
                  }}
                >
                  {!stock.status
                    ? t('product:card.unavailable')
                    : justAdded
                      ? t('product:card.added')
                      : t('product:card.addToCart')}
                </button>
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
