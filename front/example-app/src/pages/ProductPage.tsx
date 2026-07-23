import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useLocale } from '../hooks/useLocale'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/format'
import { ProductCarousel } from '../components/ProductCarousel/ProductCarousel'
import { Tabs } from '../components/Tabs/Tabs'
import { AddToCartModal } from '../components/AddToCartModal/AddToCartModal'
import {
  getCompatibleProducts,
  getProduct,
  getSimilarProducts,
} from '../data/catalogService'
import type { AttributeOption, Product } from '../data/types'

function AttributeRow({
  label,
  options,
}: {
  label: string
  options: AttributeOption[]
}) {
  if (!options.length) return null
  return (
    <div className="flex gap-2 py-2 first:pt-0">
      <dt className="w-28 shrink-0 font-semibold text-ink-900">{label}</dt>
      <dd className="text-ink-900/80">
        {options.map((o) => o.label).join(', ')}
      </dd>
    </div>
  )
}

function ProductAttributes({ product }: { product: Product }) {
  return (
    <dl className="divide-y divide-line-200">
      <AttributeRow label="Color" options={product.colors} />
      <AttributeRow label="Size" options={product.sizes} />
      <AttributeRow label="Style" options={product.styles} />
      <AttributeRow label="Material" options={product.materials} />
    </dl>
  )
}

export function ProductPage() {
  const { urlKey = '' } = useParams()
  const { country, language } = useLocale()
  const { addLine } = useCart()

  const product = getProduct(language, urlKey)
  const [color, setColor] = useState<AttributeOption | undefined>(
    product?.colors[0],
  )
  const [size, setSize] = useState<AttributeOption | undefined>(
    product?.sizes[0],
  )
  const [showAddedModal, setShowAddedModal] = useState(false)

  const similar = useMemo(
    () => (product ? getSimilarProducts(language, product.sku) : []),
    [product, language],
  )
  const compatible = useMemo(
    () => (product ? getCompatibleProducts(language, product.sku) : []),
    [product, language],
  )

  if (!product) {
    return (
      <p className="mx-auto max-w-7xl px-4 py-16 text-center text-ink-900/60 sm:px-6 lg:px-8">
        Product not found.
      </p>
    )
  }

  const handleAddToCart = () => {
    addLine({
      sku: product.sku,
      urlKey: product.urlKey,
      name: product.name,
      image: product.image,
      price: product.price,
      color,
      size,
    })
    setShowAddedModal(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-ink-900/50">
        {product.categories.map((c, i) => (
          <span key={c.id}>
            {i > 0 && ' / '}
            {c.name}
          </span>
        ))}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-line-200">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-ink-900">{product.name}</h1>
          <p className="mt-3 text-xl">
            {product.isDiscounted && (
              <span className="mr-2 text-ink-900/40 line-through">
                {formatPrice(product.originalPrice, country, language)}
              </span>
            )}
            <span
              className={
                product.isDiscounted
                  ? 'font-semibold text-accent-600'
                  : 'font-semibold'
              }
            >
              {formatPrice(product.price, country, language)}
            </span>
          </p>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-ink-900">
                Color{color ? `: ${color.label}` : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setColor(opt)}
                    aria-pressed={color?.value === opt.value}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      color?.value === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-600'
                        : 'border-line-200 text-ink-900/70'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-ink-900">
                Size{size ? `: ${size.label}` : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSize(opt)}
                    aria-pressed={size?.value === opt.value}
                    className={`min-w-10 rounded border px-3 py-1.5 text-sm ${
                      size?.value === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-600'
                        : 'border-line-200 text-ink-900/70'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-8 w-full rounded-full bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 sm:w-auto sm:px-10"
          >
            Add to cart
          </button>

          <div className="mt-8">
            <Tabs
              items={[
                {
                  label: 'Description',
                  content: product.description ? (
                    <div
                      className="prose prose-sm max-w-none text-ink-900/80"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p className="text-sm text-ink-900/60">
                      No description available.
                    </p>
                  ),
                },
                {
                  label: 'Attributes',
                  content: <ProductAttributes product={product} />,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <ProductCarousel
        title="Similar products"
        products={similar}
        visibleCount={4}
        compact
      />
      <ProductCarousel
        title="Goes well with"
        products={compatible}
        visibleCount={4}
        compact
      />

      {showAddedModal && (
        <AddToCartModal
          product={product}
          color={color}
          size={size}
          suggestions={[...similar, ...compatible]}
          onClose={() => setShowAddedModal(false)}
        />
      )}
    </div>
  )
}
