import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { ProductPage } from './ProductPage'

describe('ProductPage', () => {
  it('renders product details and lets the user pick a variant then add to cart', () => {
    renderWithProviders(<ProductPage />, {
      route: '/product/carina-cardigan',
      path: '/product/:urlKey',
    })

    expect(
      screen.getByRole('heading', { name: 'Carina Cardigan' }),
    ).toBeInTheDocument()

    const sizeButton = screen.getByRole('button', { name: 'M' })
    fireEvent.click(sizeButton)
    expect(sizeButton).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }))
    expect(
      screen.getByRole('dialog', { name: 'Added to your cart' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to cart' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Continue shopping' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows a message for an unknown product', () => {
    renderWithProviders(<ProductPage />, {
      route: '/product/does-not-exist',
      path: '/product/:urlKey',
    })
    expect(screen.getByText('Product not found.')).toBeInTheDocument()
  })
})
