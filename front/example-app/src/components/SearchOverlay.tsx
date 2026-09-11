import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useCatalog } from '../contexts/CatalogContext';
import { useAddedFlash } from '../hooks/useAddedFlash';
import { useMounted } from '../hooks/useMounted';
import { getProductFields } from './ProductCard';
import QuickAdd from './QuickAdd';
import { CmsPage, cmsPageUrl } from '../hooks/useCms';

// What `Response.getTermSuggestions()` returns, per entity type: the engine's own
// popular-search terms, not a client-side filter of a hardcoded list.
export interface TermSuggestion {
  term: string;
  resultCount: number;
  popularity: number;
}

// The panel shows one merged "popular search terms" column, but products and blog
// posts each return their own list — and a term like "dress" is popular in both, so
// the merge has to dedupe. Product terms lead: they match the primary intent of the
// search bar. A plain (non-hook) function so SearchBar.tsx can build its keyboard-nav
// sequence from exactly the same list this column renders — the two lists diverging
// is what broke arrow navigation.
export function getTermSuggestions(
  productTerms: TermSuggestion[], cmsPageTerms: TermSuggestion[],
): string[] {
  return [...new Set(
    [...(productTerms ?? []), ...(cmsPageTerms ?? [])]
      .map(suggestion => suggestion?.term)
      .filter((term): term is string => Boolean(term))
  )];
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

// Wraps every occurrence of a query word in <mark> so a blog hit shows *why* it
// matched — the title alone often doesn't contain the query verbatim. Words are
// escaped before they reach the RegExp: a query like "50% off (sale)" is user
// input, not a pattern.
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function highlightTerms(text: string, query: string): React.ReactNode {
  const words = query.trim().split(/\s+/).filter(w => w.length >= 2).map(escapeRegExp);
  if (words.length === 0) return text;
  // Capturing group keeps the delimiters, so split() returns [text, match, text, ...]
  // and the odd indexes are exactly the parts to mark.
  const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'));
  return parts.map((part, i) =>
    i % 2 === 1 ? <mark key={i} className="autocomplete-mark">{part}</mark> : part
  );
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
  // Already merged and deduped by SearchBar (getTermSuggestions), because its
  // keyboard-nav sequence has to be built from the very same list.
  termSuggestions: string[];
  resultsLoading: boolean;
  categories: any[];
  categoriesLoading: boolean;
  cmsPages: CmsPage[];
  cmsLoading: boolean;
  highlightedKey: string | null;
  navigate: (to: string) => void;
  setQuery: (q: string) => void;
  clear: () => void;
  close: () => void;
}

export default function SearchOverlay({
  open, query, results, aggregations, termSuggestions, resultsLoading, categories, categoriesLoading,
  cmsPages, cmsLoading, highlightedKey, navigate, setQuery, clear, close,
}: SearchOverlayProps) {
  // createPortal targets document.body during render, which does not exist while
  // the server pre-renders this component — even though it is a client component.
  // Gate the portal on a real mount. Must sit above the `open` early return so the
  // hook order stays stable.
  const mounted = useMounted();
  const scrollFrame = useRef<number | null>(null);

  // Reset the header offset whenever the popup closes or unmounts, and drop any frame
  // still queued. Without this the header stays translated up after a close — invisible
  // as a cause, since --acp-scroll only has an effect while .overlay-open matches, so it
  // would resurface on the *next* open as a header already scrolled away.
  useEffect(() => {
    if (!open || !mounted) return;
    return () => {
      if (scrollFrame.current !== null) {
        cancelAnimationFrame(scrollFrame.current);
        scrollFrame.current = null;
      }
      document.documentElement.style.removeProperty('--acp-scroll');
    };
  }, [open, mounted]);

  // Freeze the page while the popup is up. `overscroll-behavior: contain` on the scrim
  // (styles.css) stops a scroll gesture from *chaining* out of it, but a gesture that
  // never lands on a scrollable descendant — Space/PageDown, a trackpad flick on the
  // panel's padding — still reaches the document. Both halves are needed.
  //
  // Locking `overflow` alone removes the scrollbar and reflows the page ~15px wider;
  // the scrim hides most of that, but the header stays visible (blurred, not covered),
  // so the shift would show. Compensating with the measured scrollbar width keeps it
  // still. Restores the previous inline values rather than clearing them, and the
  // cleanup runs on unmount too, so closing the overlay by navigating cannot leave the
  // page unscrollable. Like `mounted`, this must sit above the early return.
  useEffect(() => {
    if (!open || !mounted) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [open, mounted]);

  // Publish the scrim's scroll offset so the header can ride it — the search bar scrolls
  // away with the popup instead of hovering over it, and comes back on scroll up. The
  // header lives in the layout, not in this portal, so a CSS custom property on <html> is
  // the seam: styles.css translates .header-sticky-group by -var(--acp-scroll) but only
  // while .overlay-open matches, so nothing outside the popup is affected. Same channel
  // Header already uses for --header-height.
  //
  // Clamped to the header's own height: past that the header is fully out of view and the
  // panel should keep scrolling alone. rAF-coalesced because a wheel fires far more often
  // than the compositor paints, and the cleanup clears the property so a closed popup
  // never leaves the header displaced.
  const onScrimScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    if (scrollFrame.current !== null) return;
    scrollFrame.current = requestAnimationFrame(() => {
      scrollFrame.current = null;
      const style = document.documentElement.style;
      const headerHeight = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height')
      ) || 0;
      style.setProperty('--acp-scroll', `${Math.min(top, headerHeight)}px`);
    });
  };

  if (!open || !mounted) return null;

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
      <div className="search-overlay-scrim" onScroll={onScrimScroll}>
        <div className="search-overlay-panel search-overlay-panel-prompt">
          <SearchPrompt />
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="search-overlay-scrim" onScroll={onScrimScroll}>
      <div className="search-overlay-panel">
        <div className="search-overlay-col">
          <SuggestionsColumn termSuggestions={termSuggestions} highlightedKey={highlightedKey} onSelect={closeAndGo} />
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
          <BlogSection
            query={query}
            pages={cmsPages}
            loading={cmsLoading}
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
          {withThumb ? <div className="autocomplete-skeleton-thumb skeleton-shimmer" /> : null}
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
function SuggestionsColumn({ termSuggestions, highlightedKey, onSelect }: {
  termSuggestions: string[]; highlightedKey: string | null; onSelect: (to: string) => void;
}) {
  const { t } = useTranslation('search');

  return (
    <>
      <div className="autocomplete-section-title">{t('overlay.suggestionsTitle')}</div>
      {termSuggestions.length === 0 ? (
        <EmptyNote text={t('overlay.noSuggestions')} />
      ) : (
        termSuggestions.map(term => {
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

  // The header (and its cart badge) is blurred and dimmed while the ACP is open,
  // so an add has to confirm itself in place: the card flashes green and the
  // button flips to "Added" for a moment before returning to its normal label.
  const { addedKey: addedSku, flash } = useAddedFlash();


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
                {/* Same component the grid card uses, so a configurable product cannot be added
                    here without its combination either. The guard below is why QuickAdd takes an
                    onInteract at all: the whole row navigates to the product on click, and adding
                    (or picking a size) must not — while preventDefault on mousedown keeps focus on
                    the search input, so the ACP stays open and you can add several products in a
                    row instead of it closing on the first blur. */}
                <QuickAdd
                  product={item}
                  onAdded={flash}
                  buttonClassName="autocomplete-add-to-cart"
                  onInteract={e => {
                    e.stopPropagation();
                    if (e.type === 'mousedown') e.preventDefault();
                  }}
                />
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

// Stacked under the categories, in the same column: editorial content matching the
// query. These are real cms_page documents from the search engine — the same query
// that finds "dress" products also finds the posts written about them. Like every
// other section it always renders its title plus exactly one of skeleton / empty
// note / results, so the panel never changes shape between keystrokes.
function BlogSection({ query, pages, loading, highlightedKey, onSelect }: {
  query: string; pages: CmsPage[]; loading: boolean; highlightedKey: string | null; onSelect: (to: string) => void;
}) {
  const { t } = useTranslation(['search', 'blog']);

  return (
    <div className="autocomplete-blog-group">
      <div className="autocomplete-section-title">{t('search:overlay.blogTitle')}</div>
      {loading ? (
        <SkeletonRows count={2} />
      ) : pages.length === 0 ? (
        <EmptyNote text={t('search:overlay.noBlog')} />
      ) : (
        pages.map(page => {
          const key = `blog-${page.id}`;
          return (
            <div
              key={page.id}
              data-item-key={key}
              className={`autocomplete-item autocomplete-blog ${key === highlightedKey ? 'highlighted' : ''}`}
              onClick={() => onSelect(cmsPageUrl(page.id))}
            >
              <div className="autocomplete-blog-body">
                <div className="autocomplete-blog-title">{highlightTerms(page.title, query)}</div>
                <div className="autocomplete-blog-meta">
                  {page.topic?.label}
                  {page.readingTime ? ` · ${t('blog:readingTime', { count: page.readingTime })}` : ''}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
