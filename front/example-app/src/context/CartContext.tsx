import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { getCookie, setCookie } from '../lib/cookies'
import { CartContext, cartLineKey, type CartContextValue } from './cart-context'
import type { CartLine } from '../data/types'

const CART_COOKIE = 'gally_cart'

function readCart(): CartLine[] {
  const raw = getCookie(CART_COOKIE)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readCart())

  useEffect(() => {
    setCookie(CART_COOKIE, JSON.stringify(lines), 30)
  }, [lines])

  const value = useMemo<CartContextValue>(() => {
    const addLine: CartContextValue['addLine'] = (line, qty = 1) => {
      setLines((prev) => {
        const key = cartLineKey(line)
        const existing = prev.find((l) => cartLineKey(l) === key)
        if (existing) {
          return prev.map((l) =>
            cartLineKey(l) === key ? { ...l, qty: l.qty + qty } : l,
          )
        }
        return [...prev, { ...line, qty }]
      })
    }

    const removeLine: CartContextValue['removeLine'] = (key) => {
      setLines((prev) => prev.filter((l) => cartLineKey(l) !== key))
    }

    const setQty: CartContextValue['setQty'] = (key, qty) => {
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => cartLineKey(l) !== key)
          : prev.map((l) => (cartLineKey(l) === key ? { ...l, qty } : l)),
      )
    }

    return {
      lines,
      itemCount: lines.reduce((sum, l) => sum + l.qty, 0),
      total: lines.reduce((sum, l) => sum + l.qty * l.price, 0),
      addLine,
      removeLine,
      setQty,
      clear: () => setLines([]),
    }
  }, [lines])

  return <CartContext value={value}>{children}</CartContext>
}
