import { screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { ProductCard } from './ProductCard'
import { getProduct } from '../../data/catalogService'

const inStockProduct = getProduct('fr', 'carina-cardigan')!
const outOfStockProduct = {
  ...inStockProduct,
  sku: 'OUT-OF-STOCK-SKU',
  inStock: false,
}

beforeEach(() => {
  document.cookie =
    'gally_ratings=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ProductCard stat variant', () => {
  it('shows the in-stock message with the product available', () => {
    renderWithProviders(<ProductCard product={inStockProduct} variant="stat" />)
    expect(screen.getByText('produit disponible')).toBeInTheDocument()
  })

  it('shows the out-of-stock message when the product is unavailable', () => {
    renderWithProviders(
      <ProductCard product={outOfStockProduct} variant="stat" />,
    )
    expect(screen.getByText('produit non disponible')).toBeInTheDocument()
  })

  it('keeps the same rating across remounts within the session (cookie-backed)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1)
    const { unmount } = renderWithProviders(
      <ProductCard product={inStockProduct} variant="stat" />,
    )
    expect(screen.getByLabelText('Rated 3 out of 5')).toBeInTheDocument()
    unmount()

    vi.spyOn(Math, 'random').mockReturnValue(0.9)
    renderWithProviders(<ProductCard product={inStockProduct} variant="stat" />)
    expect(screen.getByLabelText('Rated 3 out of 5')).toBeInTheDocument()
  })
})
