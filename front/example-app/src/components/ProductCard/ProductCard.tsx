import { Link } from 'react-router'
import { useLocale } from '../../hooks/useLocale'
import { formatPrice } from '../../lib/format'
import { useProductRating } from '../../lib/productRatings'
import type { Product } from '../../data/types'

function RatingStars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rated ${rating} out of 5`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            width="14"
            height="14"
            fill={i < rating ? '#ed7465' : 'none'}
            stroke={i < rating ? '#ed7465' : '#e6eaec'}
            aria-hidden="true"
          >
            <path
              strokeLinejoin="round"
              d="M10 1.6l2.47 5.15 5.53.74-4.06 3.9.99 5.61L10 14.27l-4.93 2.73.99-5.61-4.06-3.9 5.53-.74L10 1.6z"
            />
          </svg>
        ))}
      </div>
      <span className="text-xs text-ink-900/60">({rating})</span>
    </div>
  )
}

function StockStatus({ inStock }: { inStock: boolean }) {
  return (
    <p
      className={`flex items-center gap-1.5 text-xs font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}
    >
      {inStock ? (
        <svg
          viewBox="0 0 20 20"
          width="14"
          height="14"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 20 20"
          width="14"
          height="14"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.3 6.3a1 1 0 011.4 0L10 7.6l1.3-1.3a1 1 0 111.4 1.4L11.4 9l1.3 1.3a1 1 0 01-1.4 1.4L10 10.4l-1.3 1.3a1 1 0 01-1.4-1.4L8.6 9 7.3 7.7a1 1 0 010-1.4z"
          />
        </svg>
      )}
      {inStock ? 'produit disponible' : 'produit non disponible'}
    </p>
  )
}

function PriceStat({ product }: { product: Product }) {
  const { country, language } = useLocale()

  return (
    <p className="text-2xl font-bold text-ink-900">
      {formatPrice(product.price, country, language)}
    </p>
  )
}

interface ProductCardProps {
  product: Product
  imageAspectClassName?: string
  variant?: 'default' | 'stat'
}

export function ProductCard({
  product,
  imageAspectClassName = 'aspect-[3/4]',
  variant = 'default',
}: ProductCardProps) {
  const { country, language } = useLocale()
  const rating = useProductRating(product.sku)

  const image = (
    <div
      className={`${imageAspectClassName} overflow-hidden rounded-lg bg-line-200`}
    >
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  )

  if (variant === 'stat') {
    return (
      <Link
        to={`/product/${product.urlKey}`}
        className="group flex w-full flex-col gap-3 rounded-2xl border border-line-200 bg-paper-50 p-3 shadow-sm transition-shadow hover:shadow-md"
        data-testid="product-card"
      >
        {image}
        <div className="flex flex-col gap-1.5">
          <p className="truncate text-sm font-medium text-ink-900">
            {product.name}
          </p>
          {rating !== null && <RatingStars rating={rating} />}
          <PriceStat product={product} />
          <StockStatus inStock={product.inStock} />
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/product/${product.urlKey}`}
      className="group flex w-full flex-col gap-2 text-left"
      data-testid="product-card"
    >
      {image}
      <div>
        <p className="text-sm font-medium text-ink-900">{product.name}</p>
        <p className="text-sm text-ink-900/70">
          {product.isDiscounted && (
            <span className="mr-1.5 text-ink-900/40 line-through">
              {formatPrice(product.originalPrice, country, language)}
            </span>
          )}
          <span
            className={
              product.isDiscounted ? 'font-semibold text-accent-600' : ''
            }
          >
            {formatPrice(product.price, country, language)}
          </span>
        </p>
      </div>
    </Link>
  )
}
