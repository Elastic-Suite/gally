'use client'

import { useEffect, useRef } from 'react'
import Link from '../components/LocaleLink'
import { useTranslation } from 'react-i18next'
import { useSearch } from '../hooks/useSearch'
import { useTracking } from '../hooks/useTracking'
import ProductSlider from '../components/ProductSlider'
import HomeHero from '../components/HomeHero'
import HomePromoCards from '../components/HomePromoCards'
import { useCatalog } from '../contexts/CatalogContext'
import { HOMEPAGE_BLOCKS } from '../sdk/homepageBlocks'
import { getVectorDemoQueries } from '../sdk/vectorSearch'
import Icon from '../components/Icon'

// Each row shows 3 products and fetches only 3: cards hidden with CSS would still be reported by
// trackDisplay as displayed. See specs/feature-homepage-blocks.md.
const ROW_SIZE = 3

// Panel-shaped placeholder, so the page does not jump when the products arrive.
function SliderSkeleton({ end }: { end?: boolean }) {
  return (
    <div
      className={`product-slider product-slider--panel${
        end ? ' product-slider--end' : ''
      }`}
    >
      <div className="product-slider-aside">
        <div
          className="skeleton skeleton-text"
          style={{ width: '60%', height: '1.75rem' }}
        />
      </div>
      <div className="slider-track">
        {Array.from({ length: ROW_SIZE }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-card-image skeleton-shimmer" />
            <div className="skeleton-card-body">
              <div
                className="skeleton skeleton-text"
                style={{ width: '80%' }}
              />
              <div
                className="skeleton skeleton-text"
                style={{ width: '50%', marginTop: '0.5rem' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Homepage() {
  const { t, i18n } = useTranslation('category')
  const { trackDisplay } = useTracking()
  const { categories, selectedCatalog, selectedLocalizedCatalog } = useCatalog()

  // "Our selection" is a plain catalog browse of the root category, not a search and not a
  // recommendation: Gally has no product popularity data, so it is not titled "trending" —
  // product_catalog requires a real currentCategoryId, so use the root rather than
  // faking a product_search with a wildcard query.
  const rootCategory = categories.length > 0 ? categories[0] : null
  const { products, loading } = useSearch({
    pageSize: ROW_SIZE,
    categoryCode: rootCategory?.id,
  })

  // Second row: a top-level category, titled with its own name. A category listing, not
  // "new arrivals" - there is no date sort behind it. `categories` is the root then its children,
  // and the root's top products all come from the first child, so categories[1] repeated the first
  // row. categories[2] is measured not to, on all three sample shops.
  const secondCategory = categories[2] ?? categories[1] ?? null
  const categoryRow = useSearch({
    pageSize: ROW_SIZE,
    categoryCode: secondCategory?.id,
  })

  // The hero button is picked per shop. It used to send every catalogue to "dress", which on the
  // hardware and stationery shops returned nothing at all. Label and query are one pair in the
  // locale files because the catalogue's language follows the locale segment: a French visitor
  // must be sent to "robe", not "dress". A shop with no entry gets a plain browse link rather than
  // another shop's query — see specs/feature-hero-cta-per-catalog.md.
  const heroKey = `homepage.hero.shops.${selectedCatalog?.code ?? ''}`
  const hasHeroQuery =
    !!selectedCatalog && i18n.exists(`${heroKey}.query`, { ns: 'category' })
  const heroHref = hasHeroQuery
    ? `/search?q=${encodeURIComponent(t(`${heroKey}.query`))}`
    : rootCategory
    ? `/category/${rootCategory.id}`
    : null
  const heroLabel = hasHeroQuery
    ? t(`${heroKey}.cta`)
    : t('homepage.hero.browse')

  // Sample shops get the wide hero and the promo cards; any other catalog keeps the text hero.
  const shopCode = selectedCatalog?.code ?? ''
  const blocks = HOMEPAGE_BLOCKS[shopCode]
  const blocksKey = `homepage.blocks.${shopCode}`
  const vectorExamples = getVectorDemoQueries(selectedLocalizedCatalog?.code)
    .slice(0, -1)
    .slice(0, 3)

  const trackedDisplayRef = useRef('')

  useEffect(() => {
    if (products.length > 0) {
      const key = products.map((p) => p.source?.sku || p.sku).join(',')
      if (trackedDisplayRef.current !== key) {
        trackedDisplayRef.current = key
        trackDisplay(
          products.map((p, i) => ({
            sku: p.source?.sku || p.sku,
            position: i,
          }))
        )
      }
    }
  }, [products, trackDisplay])

  return (
    <div>
      {blocks ? (
        <HomeHero
          title={t(`${blocksKey}.heroTitle`)}
          body={t(`${blocksKey}.heroBody`)}
          images={blocks.heroImages}
          ctaHref={heroHref}
          ctaLabel={heroLabel}
        />
      ) : (
        <section className="hero">
          <h1>{t('homepage.heroTitle')}</h1>
          <p>{t('homepage.heroBody')}</p>
          {heroHref && (
            <Link href={heroHref} className="btn btn-coral btn-lg">
              {heroLabel}
            </Link>
          )}
        </section>
      )}

      {loading ? (
        <SliderSkeleton />
      ) : (
        <ProductSlider
          products={products.slice(0, ROW_SIZE)}
          title={t('homepage.trending')}
          panel={{
            eyebrow: t('homepage.eyebrowSelection'),
            seeAllHref: rootCategory ? `/category/${rootCategory.id}` : null,
            seeAllLabel: t('homepage.seeAll'),
          }}
        />
      )}

      {blocks && (
        <HomePromoCards
          ctaLabel={t('homepage.blocks.discover')}
          cards={blocks.cards.map((card) => ({
            key: card.key,
            title: t(`${blocksKey}.cards.${card.key}.title`),
            body: t(`${blocksKey}.cards.${card.key}.body`),
            image: card.image,
            href: `/category/${card.categoryId}`,
          }))}
        />
      )}

      {categoryRow.loading ? (
        <SliderSkeleton end />
      ) : (
        categoryRow.products.length > 0 && (
          <ProductSlider
            products={categoryRow.products.slice(0, ROW_SIZE)}
            title={
              secondCategory ? secondCategory.name : t('homepage.moreProducts')
            }
            panel={{
              eyebrow: t('homepage.eyebrowCategory'),
              seeAllHref: secondCategory
                ? `/category/${secondCategory.id}`
                : null,
              seeAllLabel: t('homepage.seeAll'),
              side: 'end',
            }}
          />
        )
      )}

      {/* Vector search: what it is for, with this shop's measured requests as examples. The last
          entry of each list is its control (a request keyword search answers well), so it stays
          off the cards. See specs/feature-home-vector-block.md. */}
      <section className="home-vector">
        <span className="home-vector-eyebrow">
          <Icon name="sparkles" />
          {t('homepage.vectorBlock.eyebrow')}
        </span>
        <h2 className="home-vector-title">{t('homepage.vectorBlock.title')}</h2>
        <p className="home-vector-body">{t('homepage.vectorBlock.body')}</p>
        {vectorExamples.length > 0 && (
          <ul className="home-vector-cases">
            {vectorExamples.map((example) => (
              <li key={example}>
                <Link
                  href={`/vector-search?q=${encodeURIComponent(example)}`}
                  className="home-vector-case"
                >
                  <span className="home-vector-quote">
                    {t('homepage.vectorBlock.quote', { query: example })}
                  </span>
                  <span className="home-vector-go">
                    {t('homepage.vectorBlock.seeResults')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/vector-search" className="btn btn-dark btn-lg">
          {t('homepage.vectorBlock.cta')}
        </Link>
      </section>
    </div>
  )
}
