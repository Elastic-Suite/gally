import { createContext } from 'react'
import type { CartLine } from '../data/types'

export function cartLineKey(
  line: Pick<CartLine, 'sku' | 'color' | 'size'>,
): string {
  return [line.sku, line.color?.value ?? '', line.size?.value ?? ''].join('|')
}

export interface CartContextValue {
  lines: CartLine[]
  itemCount: number
  total: number
  addLine: (line: Omit<CartLine, 'qty'>, qty?: number) => void
  removeLine: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
)
