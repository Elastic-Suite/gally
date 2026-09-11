'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from '../components/LocaleLink';
import Pagination from '../components/Pagination';
import { useCatalog } from '../contexts/CatalogContext';
import { useTracking } from '../hooks/useTracking';
import { getSearchManager, MEDIA_BASE_URL } from '../sdk';
import {
  COMPARE_ROW_FIELDS,
  fetchVectorSearchProducts,
  isModelLanguage,
  VECTOR_DEMO_QUERIES,
  VECTOR_MAX_RESULTS,
  VectorSearchResult,
} from '../sdk/vectorSearch';

// Keyword vs vector, same query, side by side.
//
// This is the screen that answers "what does semantic search actually buy me". It only
// works as an argument if BOTH panels are honest, so three rules govern everything below:
//
//   1. Both panels ask for COMPARE_ROW_FIELDS and render the same <ResultRow>. Same rows,
//      same thumbnail, same score treatment — the ONLY difference the visitor sees is the
//      ranking, which is the thing under comparison. An earlier version of this page (on
//      `main`) put a product grid next to a three-column SKU table, and the table lost on
//      looks before anyone read a score.
//   2. The vector panel never claims a result COUNT. See fetchVectorSearchProducts.
//   3. The two scores are never compared across the gutter. BM25 and cosine similarity are
//      different scales; each panel labels and formats its own.
//
// Rows rather than product cards: the comparison is about WHICH products come back and in
// what order, so the page wants depth far more than it wants each hit merchandised. A card
// grid showed 8 and spent most of its pixels on prices and badges that argue nothing here.
//
// Client-side, like /explain: the page is a demo console driven by a search box, it is
// NOINDEX, and there is no crawler or first-paint argument for pre-rendering a result
// set the visitor is about to replace by typing.

// Rows per page, per panel. Both panels PAGE now rather than showing one long list, so this
// is a page size and not a ceiling: every hit the keyword engine has is reachable, and the
// vector list is reachable down to VECTOR_MAX_RESULTS (the backend's kNN `k`).
//
// 25 rather than the 100 this page used to render flat. At 100 the pager would never appear
// on the sample catalogue's 85 products — pagination that cannot be exercised is pagination
// nobody has tested — and the page ran ~4900px, which is what buried the closing callout.
// At 25 the same 85 products are four pages, the pager is real, and nothing is out of reach.
const PAGE_SIZE = 25;

interface PanelState {
  products: any[];
  total: number;
  pageCount: number;
}

const EMPTY_PANEL: PanelState = { products: [], total: 0, pageCount: 0 };
const EMPTY_VECTOR: VectorSearchResult = { products: [], scores: {}, corpusSize: 0, pageCount: 0 };

// One result: rank, thumbnail, name, score. A link too, because a visitor who spots a
// surprising hit will want to check whether the engine was right about it.
//
// There is deliberately NO score bar. An earlier revision had one and it was worse than
// nothing here: every score in a panel sits within a few percent of its neighbours (0.42–0.54
// for cosine, and BM25 ties outright at 64 across whole blocks of hits), so every bar drew at
// very nearly full width. It read as a decoration that meant something, cost the widest column
// in the row, and squeezed the product name — which is the thing the visitor is actually
// comparing between the two lists. The number alone carries the precision the bar could not.
function ResultRow({
  product,
  rank,
  score,
}: {
  product: any;
  rank: number;
  score: number | undefined;
}) {
  const name = Array.isArray(product.name) ? product.name[0] : product.name || product.sku;
  const image = product.image ? `${MEDIA_BASE_URL}${product.image}` : '';

  return (
    <li className="vector-row">
      <span className="vector-row-rank">{rank}</span>
      <Link href={`/product/${encodeURIComponent(product.sku)}`} className="vector-row-link">
        <span className="vector-row-thumb">
          {image ? <img src={image} alt="" loading="lazy" /> : <span aria-hidden="true">📷</span>}
        </span>
        <span className="vector-row-name">{name}</span>
      </Link>
      <span className="vector-row-score">{score === undefined ? '—' : formatScore(score)}</span>
    </li>
  );
}

// BM25 runs to ~64 on this catalogue, cosine similarity to ~0.6. One format cannot serve both:
// two decimals on a BM25 score is false precision, and rounding a similarity to a whole number
// collapses every row to "1".
function formatScore(score: number): string {
  return score >= 10 ? score.toFixed(0) : score.toFixed(2);
}

// The panel's pager: src/components/Pagination.tsx with this page's scrolling. Each panel owns
// one, because the two lists have unrelated lengths (7 keyword hits beside 85 ranked vector rows
// is the normal case) and a single shared pager would have to lie about one of them.
//
// Placed ABOVE the list, not below it as SearchPage does. A page is 25 rows, so a pager at the
// foot is a pager you have to scroll a screenful to reach and another screenful back from — and
// with two lists side by side you would be doing that in whichever column you were not reading.
// At the top it sits with the panel's own header, where the count badge already is.
//
// It scrolls its own panel back into view rather than `window.scrollTo(0)` as SearchPage does:
// with two side-by-side lists, jumping to the top of the document on every page change loses
// the panel the visitor was reading. That pairs with the top placement — after changing page the
// pager is still under the cursor. The nav ref is how it finds its panel; the pager itself has
// no idea what it is inside.
function PanelPager({
  page,
  pageCount,
  onPage,
  label,
}: {
  page: number;
  pageCount: number;
  onPage: (p: number) => void;
  label: string;
}) {
  const { t } = useTranslation('vectorSearch');
  const navRef = useRef<HTMLElement>(null);

  const go = (p: number) => {
    onPage(p);
    (navRef.current?.closest('.vector-panel') as HTMLElement | null)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Pagination
      ref={navRef}
      page={page}
      pageCount={pageCount}
      prevLabel={t('search:page.prev')}
      nextLabel={t('search:page.next')}
      ariaLabel={label}
      onPage={go}
    />
  );
}

export default function VectorSearchPage() {
  const { t } = useTranslation('vectorSearch');
  const { selectedLocalizedCatalog } = useCatalog();
  const { trackSearch, trackDisplay } = useTracking();

  const [input, setInput] = useState(VECTOR_DEMO_QUERIES[0]);
  // Query and both page numbers live in ONE state object so a new query cannot be committed
  // without resetting the pages in the same update. Held as three useStates they drift: the
  // fetch effects see the new query with the old page for one render and briefly show page 4
  // of a result set that now has one page.
  const [q, setQ] = useState({ text: VECTOR_DEMO_QUERIES[0], kwPage: 1, vecPage: 1 });
  const query = q.text;
  const [keyword, setKeyword] = useState<PanelState>(EMPTY_PANEL);
  const [vector, setVector] = useState<VectorSearchResult>(EMPTY_VECTOR);
  const [kwLoading, setKwLoading] = useState(false);
  const [vecLoading, setVecLoading] = useState(false);

  const catalogCode = selectedLocalizedCatalog?.code;
  const modelSpeaksLocale = isModelLanguage(selectedLocalizedCatalog?.locale);

  // The keyword side goes through the SDK exactly as SearchPage does — same metadata, same
  // request type, same _score sort. Only the PROJECTION differs (COMPARE_ROW_FIELDS instead
  // of PRODUCT_FIELDS), which changes what each hit carries, never which hits come back or
  // in what order. Anything that touched the ranking would stop this being the search this
  // storefront actually ships, which is the only reason the comparison means anything.
  const runKeyword = useCallback(async (
    code: string, search: string, page: number
  ): Promise<PanelState> => {
    try {
      const response = await getSearchManager().search({
        localizedCatalog: code,
        metadata: 'product',
        searchQuery: search,
        currentPage: page,
        pageSize: PAGE_SIZE,
        isAutocomplete: false,
        selectedFields: COMPARE_ROW_FIELDS,
        filters: [],
        sortField: '_score',
        sortDirection: 'desc',
      });
      return {
        products: response.getCollection(),
        total: response.getTotalCount(),
        pageCount: response.getLastPage(),
      };
    } catch {
      return EMPTY_PANEL;
    }
  }, []);

  // Two independent effects, not one Promise.all. Paging one panel must not refetch the other:
  // they are separate lists of different lengths, and re-running the vector query because the
  // visitor moved to page 2 of the keyword list would make the untouched panel flash. The
  // panels still land together on a NEW query, because both effects fire on the same change.
  useEffect(() => {
    if (!catalogCode || !query.trim()) return;
    let cancelled = false;
    setKwLoading(true);
    runKeyword(catalogCode, query, q.kwPage).then(k => {
      if (cancelled) return;
      setKeyword(k);
      setKwLoading(false);
    });
    return () => { cancelled = true; };
  }, [catalogCode, query, q.kwPage, runKeyword]);

  useEffect(() => {
    if (!catalogCode || !query.trim()) return;
    let cancelled = false;
    setVecLoading(true);
    fetchVectorSearchProducts(catalogCode, query, PAGE_SIZE, q.vecPage).then(v => {
      if (cancelled) return;
      setVector(v);
      setVecLoading(false);
    });
    return () => { cancelled = true; };
  }, [catalogCode, query, q.vecPage]);

  // Rule 4 of AGENTS.md: a search surface stays tracked. The KEYWORD panel is what gets
  // reported, and its real total — this page is a place where the storefront's own search
  // is run, so a zero-result query here must land in search analytics as the zero-result
  // query it was. That is the same data the merchandiser would use to discover the gap
  // this page exists to demonstrate. The vector panel is deliberately not tracked as a
  // second SEARCH: it is one query, not two, and double-counting would inflate the very
  // report the demo points at.
  //
  // SEARCH fires once per (catalog, query) — NOT per page. Paging is not a new search, and
  // counting it as one would inflate the very zero-result report this page exists to point at.
  // DISPLAY fires per page, with positions offset by the page, because each page really is a
  // different set of products being shown. Same split SearchPage makes.
  const trackedRef = useRef('');
  useEffect(() => {
    if (kwLoading || !query.trim()) return;
    const key = `${catalogCode}|${query}`;
    if (trackedRef.current === key) return;
    trackedRef.current = key;
    trackSearch(query, keyword.total, q.kwPage, keyword.pageCount);
  }, [kwLoading, query, catalogCode, keyword, q.kwPage, trackSearch]);

  const trackedDisplayRef = useRef('');
  useEffect(() => {
    if (kwLoading || keyword.products.length === 0) return;
    const key = `${catalogCode}|${query}|${q.kwPage}`;
    if (trackedDisplayRef.current === key) return;
    trackedDisplayRef.current = key;
    trackDisplay(keyword.products.map((p: any, i: number) => ({
      sku: p.sku,
      position: (q.kwPage - 1) * PAGE_SIZE + i,
    })));
  }, [kwLoading, keyword, catalogCode, query, q.kwPage, trackDisplay]);

  function runQuery(text: string) {
    setQ({ text, kwPage: 1, vecPage: 1 });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    runQuery(input.trim());
  }

  function pick(demo: string) {
    setInput(demo);
    runQuery(demo);
  }

  const keywordEmpty = !kwLoading && keyword.products.length === 0;
  // How many vector rows are actually reachable: the corpus, or the kNN ceiling if smaller.
  const vectorReach = Math.min(vector.corpusSize, VECTOR_MAX_RESULTS);

  return (
    <div className="vector-page">
      {/* Everything above the panels is centred: it all applies to BOTH of them equally, and
          left-aligning it would visually attach the shared controls to the left panel. */}
      <div className="vector-head">
        <div className="breadcrumb">{t('breadcrumb')}</div>
        <h1>{t('title')}</h1>
        <p className="vector-intro">{t('intro')}</p>

        <form className="vector-search-form" onSubmit={submit}>
          <input
            type="text"
            className="vector-search-input"
            placeholder={t('placeholder')}
            value={input}
            onChange={e => setInput(e.target.value)}
            aria-label={t('placeholder')}
          />
          <button type="submit" className="vector-search-submit">{t('submit')}</button>
        </form>

        <div className="vector-suggestions">
          <span className="vector-suggestions-label">{t('tryLabel')}</span>
          {VECTOR_DEMO_QUERIES.map(demo => (
            <button
              key={demo}
              type="button"
              className={`vector-suggestion ${demo === query ? 'is-active' : ''}`}
              onClick={() => pick(demo)}
            >
              {demo}
            </button>
          ))}
        </div>

        {/* The model is monolingual English and so are the product names, in every
            catalogue. Saying so beats letting a French visitor type `bijoux`, get a skirt
            ranked first with a confident 0.41, and conclude vector search does not work. */}
        {!modelSpeaksLocale && (
          <p className="vector-language-note">{t('languageNote')}</p>
        )}
      </div>

      <div className="vector-compare">
        <section className="vector-panel vector-panel--keyword">
          <header className="vector-panel-head">
            <h2>{t('keyword.title')}</h2>
            <p>{t('keyword.subtitle')}</p>
            <span className="vector-panel-count">
              {kwLoading ? t('loading') : t('keyword.count', { count: keyword.total })}
            </span>
          </header>

          {keywordEmpty ? (
            <div className="vector-empty">
              <div className="vector-empty-icon" aria-hidden="true">🔍</div>
              <h3>{t('keyword.emptyTitle', { query })}</h3>
              <p>{t('keyword.emptyBody')}</p>
            </div>
          ) : (
            <>
              <PanelPager
                page={q.kwPage}
                pageCount={keyword.pageCount}
                onPage={p => setQ(s => ({ ...s, kwPage: p }))}
                label={t('keyword.title')}
              />
              <div className="vector-list-legend">
                <span>{t('rows.product')}</span>
                <span>{t('keyword.scoreLabel')}</span>
              </div>
              <ol className="vector-list">
                {keyword.products.map((p: any, i: number) => (
                  <ResultRow
                    key={p.sku}
                    product={p}
                    rank={(q.kwPage - 1) * PAGE_SIZE + i + 1}
                    score={p.score}
                  />
                ))}
              </ol>
            </>
          )}
        </section>

        <section className="vector-panel vector-panel--vector">
          <header className="vector-panel-head">
            <h2>{t('vector.title')}</h2>
            <p>{t('vector.subtitle')}</p>
            <span className="vector-panel-count">
              {/* Describes the whole RANKED SET, not the current page — paging moves a window
                  over one ranking, it does not run a new one. "All 85 products, ranked by
                  similarity" while the corpus is within the kNN ceiling; once a catalogue
                  outgrows k it becomes "Top 100 of 1200", which is the honest statement of
                  what is reachable. Never a result count either way: see
                  fetchVectorSearchProducts. */}
              {vecLoading
                ? t('loading')
                : vectorReach >= vector.corpusSize
                  ? t('vector.countAll', { corpus: vector.corpusSize })
                  : t('vector.count', { count: vectorReach, corpus: vector.corpusSize })}
            </span>
          </header>

          {!vecLoading && vector.products.length === 0 ? (
            <div className="vector-empty">
              <div className="vector-empty-icon" aria-hidden="true">⚠️</div>
              <h3>{t('vector.unavailableTitle')}</h3>
              <p>{t('vector.unavailableBody')}</p>
            </div>
          ) : (
            <>
              <PanelPager
                page={q.vecPage}
                pageCount={vector.pageCount}
                onPage={p => setQ(s => ({ ...s, vecPage: p }))}
                label={t('vector.title')}
              />
              <div className="vector-list-legend">
                <span>{t('rows.product')}</span>
                <span>{t('vector.scoreLabel')}</span>
              </div>
              <ol className="vector-list">
                {vector.products.map((p: any, i: number) => (
                  <ResultRow
                    key={p.sku}
                    product={p}
                    rank={(q.vecPage - 1) * PAGE_SIZE + i + 1}
                    score={vector.scores[p.sku]}
                  />
                ))}
              </ol>
            </>
          )}
        </section>
      </div>

      {/* Not a footnote in the "small print" sense — this is the interpretive key to the whole
          page, and the one thing a visitor must read before concluding that the right-hand engine
          simply wins. It is styled as a callout for that reason. It stays BELOW the panels because
          it opens with "note the asymmetry": it is an observation about results already seen, and
          it does not read as anything before them. */}
      <aside className="vector-footnote">
        <h2 className="vector-footnote-title">{t('footnoteTitle')}</h2>
        <p>{t('footnote')}</p>
      </aside>
    </div>
  );
}
