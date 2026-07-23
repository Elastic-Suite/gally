import { ProductCard } from '../ProductCard/ProductCard'
import type { Product } from '../../data/types'

interface ProductGridProps {
  products: Product[]
  columnsClassName?: string
  cardVariant?: 'default' | 'stat'
}

export function ProductGrid({
  products,
  columnsClassName = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  cardVariant = 'default',
}: ProductGridProps) {
  if (!products.length) {
    return (
      <p className="py-16 text-center text-ink-900/60">
        No products match these filters.
      </p>
    )
  }

  return (
    <div className={`grid gap-x-4 gap-y-8 ${columnsClassName}`}>
      {products.map((product) => (
        <ProductCard
          key={product.sku}
          product={product}
          variant={cardVariant}
        />
      ))}
    </div>
  )
}
