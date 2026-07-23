import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useLocale } from '../hooks/useLocale'
import { useCart } from '../hooks/useCart'
import { cartLineKey } from '../context/cart-context'
import { COUNTRIES } from '../context/locale-context'
import { formatPrice } from '../lib/format'
import { estimateShippingCost } from '../lib/shipping'
import { ProductCarousel } from '../components/ProductCarousel/ProductCarousel'
import {
  getCompatibleProducts,
  getSimilarProducts,
} from '../data/catalogService'
import type { Country } from '../data/types'

export function CartPage() {
  const { country, language } = useLocale()
  const { lines, itemCount, total, removeLine, setQty } = useCart()
  const [shippingCountry, setShippingCountry] = useState<Country>(country)
  const [shippingEstimate, setShippingEstimate] = useState<number | null>(null)

  const crossSells = useMemo(() => {
    if (!lines.length) return []
    const seedSku = lines[0].sku
    const inCart = new Set(lines.map((l) => l.sku))
    const seen = new Set<string>()
    return [
      ...getCompatibleProducts(language, seedSku, 6),
      ...getSimilarProducts(language, seedSku, 6),
    ]
      .filter((p) => {
        if (inCart.has(p.sku) || seen.has(p.sku)) return false
        seen.add(p.sku)
        return true
      })
      .slice(0, 6)
  }, [lines, language])

  const estimateShipping = () => {
    setShippingEstimate(estimateShippingCost(shippingCountry, itemCount))
  }

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-ink-900/60">Your cart is empty.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-brand-500 hover:underline"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900">Your cart</h1>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
        <ul className="flex-1 divide-y divide-line-200 rounded-lg border border-line-200 p-5">
          {lines.map((line) => {
            const key = cartLineKey(line)
            return (
              <li
                key={key}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <Link
                  to={`/product/${line.urlKey}`}
                  className="h-20 w-16 shrink-0 overflow-hidden rounded bg-line-200"
                >
                  <img
                    src={line.image}
                    alt={line.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/product/${line.urlKey}`}
                    className="font-medium text-ink-900 hover:text-brand-500"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink-900/60">
                    {[line.color?.label, line.size?.label]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <label className="mt-2 flex items-center gap-2 text-sm text-ink-900/70">
                    Qty
                    <input
                      type="number"
                      min={1}
                      value={line.qty}
                      onChange={(e) => setQty(key, Number(e.target.value))}
                      className="w-16 rounded border border-line-200 px-2 py-1"
                    />
                  </label>
                </div>
                <div className="text-right">
                  <p className="font-medium text-ink-900">
                    {formatPrice(line.price * line.qty, country, language)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeLine(key)}
                    className="mt-2 text-sm text-accent-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="rounded-lg border border-line-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900/70">
              Order summary
            </h2>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-900/70">Subtotal</dt>
                <dd className="font-medium text-ink-900">
                  {formatPrice(total, country, language)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-900/70">Shipping</dt>
                <dd className="font-medium text-ink-900">
                  {shippingEstimate !== null
                    ? formatPrice(shippingEstimate, country, language)
                    : 'Estimate below'}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex justify-between border-t border-line-200 pt-3 text-base font-semibold text-ink-900">
              <span>Total</span>
              <span>
                {formatPrice(
                  total + (shippingEstimate ?? 0),
                  country,
                  language,
                )}
              </span>
            </div>
            <Link
              to="/checkout"
              className="mt-4 block w-full rounded-full bg-brand-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-600"
            >
              Proceed to checkout
            </Link>
          </div>

          <div className="mt-6 rounded-lg border border-line-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900/70">
              Shipping estimator
            </h2>
            <label className="mt-3 flex flex-col gap-1 text-sm text-ink-900/70">
              Delivery country
              <select
                value={shippingCountry}
                onChange={(e) => setShippingCountry(e.target.value as Country)}
                className="rounded border border-line-200 px-2 py-1.5"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={estimateShipping}
              className="mt-3 w-full rounded-full border border-brand-500 py-2 text-sm font-semibold text-brand-500 hover:bg-brand-50"
            >
              Estimate shipping cost
            </button>
          </div>
        </aside>
      </div>

      {crossSells.length > 0 && (
        <ProductCarousel
          title="You might also like"
          products={crossSells}
          visibleCount={4}
          compact
        />
      )}
    </div>
  )
}
