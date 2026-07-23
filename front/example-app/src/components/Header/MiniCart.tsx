import { useState } from 'react'
import { Link } from 'react-router'
import { useCart } from '../../hooks/useCart'
import { useLocale } from '../../hooks/useLocale'
import { cartLineKey } from '../../context/cart-context'
import { formatPrice } from '../../lib/format'
import { CartIcon } from './CartIcon'

export function MiniCart() {
  const { country, language } = useLocale()
  const { lines, total } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <CartIcon />
      {open && (
        <div className="absolute right-0 top-full z-30 w-80 rounded-lg border border-line-200 bg-paper-50 p-4 text-ink-900 shadow-xl">
          {lines.length === 0 ? (
            <p className="text-sm text-ink-900/60">Your cart is empty.</p>
          ) : (
            <>
              <ul className="flex max-h-72 flex-col gap-3 overflow-y-auto">
                {lines.map((line) => (
                  <li
                    key={cartLineKey(line)}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={line.image}
                      alt=""
                      className="h-14 w-11 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {line.name}
                      </p>
                      <p className="text-xs text-ink-900/60">
                        {[line.color?.label, line.size?.label]
                          .filter(Boolean)
                          .join(' · ')}{' '}
                        · Qty {line.qty}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium">
                      {formatPrice(line.price * line.qty, country, language)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-line-200 pt-3 text-sm font-semibold">
                <span>Total</span>
                <span>{formatPrice(total, country, language)}</span>
              </div>
            </>
          )}
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="mt-3 block w-full rounded-full bg-brand-500 py-2 text-center text-sm font-semibold text-white hover:bg-brand-600"
          >
            Go to cart
          </Link>
        </div>
      )}
    </div>
  )
}
