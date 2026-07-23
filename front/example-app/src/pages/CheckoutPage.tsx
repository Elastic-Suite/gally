import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useLocale } from '../hooks/useLocale'
import { useCart } from '../hooks/useCart'
import { cartLineKey } from '../context/cart-context'
import { COUNTRIES } from '../context/locale-context'
import { formatPrice } from '../lib/format'
import { estimateShippingCost } from '../lib/shipping'
import type { Country } from '../data/types'

type PaymentMethod = 'card' | 'paypal'

function generateOrderNumber(): string {
  return `GS-${Math.floor(100000 + Math.random() * 900000)}`
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { country, language } = useLocale()
  const { lines, itemCount, total, clear } = useCart()

  const [deliveryCountry, setDeliveryCountry] = useState<Country>(country)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')

  const shipping = useMemo(
    () => estimateShippingCost(deliveryCountry, itemCount),
    [deliveryCountry, itemCount],
  )
  const grandTotal = total + shipping

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const orderNumber = generateOrderNumber()
    clear()
    navigate('/thank-you', {
      state: { orderNumber, lines, total: grandTotal },
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start"
      >
        <div className="flex-1 rounded-lg border border-line-200 p-5">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900/70">
              Contact
            </h2>
            <label className="mt-3 flex flex-col gap-1 text-sm text-ink-900/70">
              Email
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="rounded border border-line-200 px-3 py-2 text-ink-900"
              />
            </label>
          </section>

          <section className="mt-6 border-t border-line-200 pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900/70">
              Shipping address
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-ink-900/70">
                First name
                <input
                  required
                  className="rounded border border-line-200 px-3 py-2 text-ink-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-900/70">
                Last name
                <input
                  required
                  className="rounded border border-line-200 px-3 py-2 text-ink-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-900/70 sm:col-span-2">
                Address
                <input
                  required
                  className="rounded border border-line-200 px-3 py-2 text-ink-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-900/70">
                City
                <input
                  required
                  className="rounded border border-line-200 px-3 py-2 text-ink-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-900/70">
                Postal code
                <input
                  required
                  className="rounded border border-line-200 px-3 py-2 text-ink-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-900/70 sm:col-span-2">
                Country
                <select
                  value={deliveryCountry}
                  onChange={(e) =>
                    setDeliveryCountry(e.target.value as Country)
                  }
                  className="rounded border border-line-200 px-3 py-2 text-ink-900"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="mt-6 border-t border-line-200 pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900/70">
              Payment
            </h2>
            <div className="mt-3 flex gap-4 text-sm text-ink-900">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-brand-500"
                />
                Credit card
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="accent-brand-500"
                />
                PayPal
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-ink-900/70 sm:col-span-2">
                  Card number
                  <input
                    required
                    placeholder="4242 4242 4242 4242"
                    className="rounded border border-line-200 px-3 py-2 text-ink-900"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink-900/70">
                  Expiry
                  <input
                    required
                    placeholder="MM/YY"
                    className="rounded border border-line-200 px-3 py-2 text-ink-900"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink-900/70">
                  CVV
                  <input
                    required
                    placeholder="123"
                    className="rounded border border-line-200 px-3 py-2 text-ink-900"
                  />
                </label>
              </div>
            )}
          </section>
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="rounded-lg border border-line-200 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900/70">
              Order summary
            </h2>
            <ul className="mt-4 flex flex-col gap-3 divide-y divide-line-200">
              {lines.map((line) => (
                <li
                  key={cartLineKey(line)}
                  className="flex items-center gap-3 pt-3 first:pt-0"
                >
                  <img
                    src={line.image}
                    alt={line.name}
                    className="h-14 w-11 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {line.name}
                    </p>
                    <p className="text-xs text-ink-900/60">
                      {[line.color?.label, line.size?.label]
                        .filter(Boolean)
                        .join(' · ')}{' '}
                      · Qty {line.qty}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-ink-900">
                    {formatPrice(line.price * line.qty, country, language)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 flex flex-col gap-2 border-t border-line-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-900/70">Subtotal</dt>
                <dd className="font-medium text-ink-900">
                  {formatPrice(total, country, language)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-900/70">Shipping</dt>
                <dd className="font-medium text-ink-900">
                  {formatPrice(shipping, country, language)}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex justify-between border-t border-line-200 pt-3 text-base font-semibold text-ink-900">
              <span>Total</span>
              <span>{formatPrice(grandTotal, country, language)}</span>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Place order
            </button>
          </div>
        </aside>
      </form>
    </div>
  )
}
