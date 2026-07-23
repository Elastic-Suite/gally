import { useRef } from 'react'
import { ProductCard } from '../ProductCard/ProductCard'
import type { Product } from '../../data/types'

interface ProductCarouselProps {
  title: string
  products: Product[]
  /** Number of cards visible in the viewport at once; extra products stay scrollable. */
  visibleCount?: number
  /** Shorter cards, for compact recommendation rails. */
  compact?: boolean
}

export function ProductCarousel({
  title,
  products,
  visibleCount = 4,
  compact = false,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  if (!products.length) return null

  const gapRem = 1
  const itemWidth = `calc((100% - ${(visibleCount - 1) * gapRem}rem) / ${visibleCount})`

  const scrollBy = (direction: 1 | -1) => {
    const amount = trackRef.current
      ? trackRef.current.clientWidth / visibleCount
      : 320
    trackRef.current?.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink-900">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="rounded-full border border-line-200 p-2 hover:bg-brand-50"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="rounded-full border border-line-200 p-2 hover:bg-brand-50"
          >
            ›
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((product) => (
          <div
            key={product.sku}
            className="shrink-0 snap-start"
            style={{ width: itemWidth }}
          >
            <ProductCard
              product={product}
              imageAspectClassName={compact ? 'aspect-square' : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
