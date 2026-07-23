import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { ThankYouPage } from './ThankYouPage'

const orderState = {
  orderNumber: 'GS-123456',
  total: 78,
  lines: [
    {
      sku: 'VSW01',
      urlKey: 'carina-cardigan',
      name: 'Carina Cardigan',
      image: 'x.jpg',
      price: 78,
      qty: 1,
    },
  ],
}

describe('ThankYouPage', () => {
  it('shows the order number and summary passed via navigation state', () => {
    renderWithProviders(<ThankYouPage />, { state: orderState })

    expect(screen.getByText('GS-123456')).toBeInTheDocument()
    expect(screen.getByText('Carina Cardigan')).toBeInTheDocument()
  })

  it('shows a generic message when no order state is available', () => {
    renderWithProviders(<ThankYouPage />)

    expect(
      screen.getByText(
        'Your order has been placed. A confirmation email is on its way.',
      ),
    ).toBeInTheDocument()
  })
})
