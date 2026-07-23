import { useEffect } from 'react'
import { Link } from 'react-router'
import { useLocale } from '../../hooks/useLocale'
import { formatPrice } from '../../lib/format'
import { ProductCard } from '../ProductCard/ProductCard'
import type { AttributeOption, Product } from '../../data/types'

interface AddToCartModalProps {
  product: Product
  color?: AttributeOption
  size?: AttributeOption
  suggestions: Product[]
  onClose: () => void
}

export function AddToCartModal({
  product,
  color,
  size,
  suggestions,
  onClose,
}: AddToCartModalProps) {
  const { country, language } = useLocale()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-to-cart-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-paper-50 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2
            id="add-to-cart-title"
            className="text-lg font-semibold text-ink-900"
          >
            Added to your cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl leading-none text-ink-900/50 hover:text-ink-900"
          >
            &times;
          </button>
        </div>

        <div className="mt-4 flex items-center gap-4 border-b border-line-200 pb-4">
          <img
            src={product.image}
            alt={product.name}
            className="h-24 w-20 shrink-0 rounded object-cover"
          />
          <div>
            <p className="font-medium text-ink-900">{product.name}</p>
            <p className="text-sm text-ink-900/60">
              {[color?.label, size?.label].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-1 font-semibold text-ink-900">
              {formatPrice(product.price, country, language)}
            </p>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-4">
            <p className="mb-3 text-sm font-semibold text-ink-900">
              You might also like
            </p>
            <div className="grid grid-cols-3 gap-3">
              {suggestions.slice(0, 3).map((p) => (
                <ProductCard
                  key={p.sku}
                  product={p}
                  imageAspectClassName="aspect-square"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-line-200 py-2.5 text-sm font-semibold text-ink-900 hover:bg-line-200/40"
          >
            Continue shopping
          </button>
          <Link
            to="/cart"
            className="flex-1 rounded-full bg-brand-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-600"
          >
            Go to cart
          </Link>
        </div>
      </div>
    </div>
  )
}
