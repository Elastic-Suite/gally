import { Link } from 'react-router'
import { useLocale } from '../hooks/useLocale'
import { ProductCarousel } from '../components/ProductCarousel/ProductCarousel'
import {
  findCategoryById,
  getAllProducts,
  getBlog,
  getProductsForCategory,
} from '../data/catalogService'

const LOOKBOOK_CATEGORY_IDS = ['cat_14', 'cat_9', 'cat_6', 'cat_5']

export function HomePage() {
  const { language } = useLocale()

  const hero = findCategoryById(language, 'cat_19') // "Perfectly Beachy" editorial collection
  const newArrivals = getProductsForCategory(language, 'cat_7')
  const editorsPicks = getProductsForCategory(language, 'cat_15')
  const mostPopular = getAllProducts(language)
    .filter((_, index) => index % 5 === 0)
    .slice(0, 10)

  const promoDresses = findCategoryById(language, 'cat_14')
  const promoAccessories = findCategoryById(language, 'cat_3')
  const articleOfTheMonth = getBlog(language)
    .flatMap((section) => section.articles)
    .find((article) => article.slug === 'bien-choisir-son-gilet')

  const lookbook = LOOKBOOK_CATEGORY_IDS.map((id) =>
    findCategoryById(language, id),
  ).filter((c): c is NonNullable<typeof c> => Boolean(c?.image))

  return (
    <div>
      <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-ink-900 sm:min-h-[520px]">
        {hero?.image && (
          <img
            src={hero.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-widest text-accent-300">
            Shop the look
          </p>
          <h1 className="mt-2 max-w-xl text-4xl font-bold text-paper-50 sm:text-5xl">
            {hero?.name ?? 'New season, new silhouettes'}
          </h1>
          <Link
            to={hero ? `/category/${hero.slug}` : '/'}
            className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Discover the collection
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {promoDresses?.image && (
            <Link
              to={`/category/${promoDresses.slug}`}
              className="group relative isolate flex aspect-[4/5] items-end overflow-hidden rounded-xl"
            >
              <img
                src={promoDresses.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
              <div className="relative p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-accent-300">
                  New season
                </p>
                <p className="mt-1 text-lg font-semibold text-paper-50">
                  {promoDresses.name}
                </p>
              </div>
            </Link>
          )}

          {promoAccessories?.image && (
            <Link
              to={`/category/${promoAccessories.slug}`}
              className="group relative isolate flex aspect-[4/5] items-end overflow-hidden rounded-xl"
            >
              <img
                src={promoAccessories.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
              <div className="relative p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-accent-300">
                  Finishing touches
                </p>
                <p className="mt-1 text-lg font-semibold text-paper-50">
                  {promoAccessories.name}
                </p>
              </div>
            </Link>
          )}

          {articleOfTheMonth && (
            <Link
              to={`/blogs/${articleOfTheMonth.slug}`}
              className="group relative isolate flex aspect-[4/5] items-end overflow-hidden rounded-xl"
            >
              <img
                src={articleOfTheMonth.heroImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/20 to-transparent" />
              <div className="relative p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-accent-300">
                  L&rsquo;article du mois
                </p>
                <p className="mt-1 text-lg font-semibold text-paper-50">
                  {articleOfTheMonth.title}
                </p>
              </div>
            </Link>
          )}
        </div>
      </section>

      <ProductCarousel
        title="New arrivals"
        products={newArrivals}
        visibleCount={4}
        compact
      />
      <ProductCarousel
        title="Editor's picks"
        products={editorsPicks}
        visibleCount={4}
        compact
      />
      <ProductCarousel
        title="Most popular"
        products={mostPopular}
        visibleCount={4}
        compact
      />

      {lookbook.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-xl font-semibold text-ink-900">Lookbook</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {lookbook.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-line-200">
                  <img
                    src={category.image!}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-ink-900 group-hover:text-brand-500">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
