import { Link, useLocation } from 'react-router'
import { useLocale } from '../hooks/useLocale'
import { formatPrice } from '../lib/format'
import type { CartLine } from '../data/types'

interface ThankYouState {
  orderNumber: string
  lines: CartLine[]
  total: number
}

function isThankYouState(value: unknown): value is ThankYouState {
  return typeof value === 'object' && value !== null && 'orderNumber' in value
}

export function ThankYouPage() {
  const { country, language } = useLocale()
  const { state } = useLocation()
  const order = isThankYouState(state) ? state : undefined

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <svg
        viewBox="0 0 24 24"
        width="56"
        height="56"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="mx-auto text-green-600"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12.5l2.5 2.5L16 9"
        />
      </svg>

      <h1 className="mt-4 text-2xl font-bold text-ink-900">
        Thank you for your order!
      </h1>

      {order ? (
        <>
          <p className="mt-2 text-ink-900/70">
            Your order{' '}
            <span className="font-semibold text-ink-900">
              {order.orderNumber}
            </span>{' '}
            has been placed. A confirmation email is on its way.
          </p>

          <div className="mt-8 rounded-lg border border-line-200 p-5 text-left">
            <ul className="flex flex-col divide-y divide-line-200">
              {order.lines.map((line, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
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
            <div className="mt-3 flex justify-between border-t border-line-200 pt-3 text-base font-semibold text-ink-900">
              <span>Total paid</span>
              <span>{formatPrice(order.total, country, language)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-2 text-ink-900/70">
          Your order has been placed. A confirmation email is on its way.
        </p>
      )}

      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-brand-500 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Continue shopping
      </Link>
    </div>
  )
}
