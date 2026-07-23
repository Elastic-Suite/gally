import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { CartPage } from './CartPage'

const line = {
  sku: 'VSW01',
  urlKey: 'carina-cardigan',
  name: 'Carina Cardigan',
  image: 'x.jpg',
  price: 78,
  qty: 2,
}

beforeEach(() => {
  document.cookie = `gally_cart=${encodeURIComponent(JSON.stringify([line]))}; path=/`
})

describe('CartPage', () => {
  it('lists cart lines with their total and removes a line', () => {
    renderWithProviders(<CartPage />)

    expect(screen.getByText('Carina Cardigan')).toBeInTheDocument()
    expect(screen.getAllByText(/156,00.€/).length).toBeGreaterThanOrEqual(2)
    expect(
      screen.getByRole('link', { name: 'Proceed to checkout' }),
    ).toHaveAttribute('href', '/checkout')

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
  })
})
