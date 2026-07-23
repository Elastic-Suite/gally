import { Link } from 'react-router'
import { useCart } from '../../hooks/useCart'

export function CartIcon() {
  const { itemCount } = useCart()

  return (
    <Link
      to="/cart"
      aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart'}
      className="px-2 py-2 text-paper-50 hover:text-accent-300"
    >
      <span className="relative block h-6 w-6">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        {itemCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white ring-2 ring-brand-900"
          >
            {itemCount}
          </span>
        )}
      </span>
    </Link>
  )
}
