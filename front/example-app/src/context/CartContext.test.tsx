import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { CartProvider } from './CartContext'
import { useCart } from '../hooks/useCart'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

const line = {
  sku: 'VSW01',
  urlKey: 'carina-cardigan',
  name: 'Carina Cardigan',
  image: 'x.jpg',
  price: 78,
}

beforeEach(() => {
  document.cookie = 'gally_cart=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
})

describe('useCart', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.lines).toHaveLength(0)
    expect(result.current.itemCount).toBe(0)
  })

  it('adds a line and increments quantity on repeat add', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addLine(line))
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.itemCount).toBe(1)

    act(() => result.current.addLine(line))
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.itemCount).toBe(2)
    expect(result.current.total).toBe(156)
  })

  it('treats different variants as separate lines', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() =>
      result.current.addLine({ ...line, color: { label: 'Doré', value: '5' } }),
    )
    act(() =>
      result.current.addLine({
        ...line,
        color: { label: 'Kaki', value: '23' },
      }),
    )

    expect(result.current.lines).toHaveLength(2)
  })

  it('removes a line', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addLine(line))
    const key = `${line.sku}||`
    act(() => result.current.removeLine(key))

    expect(result.current.lines).toHaveLength(0)
  })
})
