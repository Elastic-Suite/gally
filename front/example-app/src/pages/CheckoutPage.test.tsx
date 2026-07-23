import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { CheckoutPage } from './CheckoutPage'

const line = {
  sku: 'VSW01',
  urlKey: 'carina-cardigan',
  name: 'Carina Cardigan',
  image: 'x.jpg',
  price: 78,
  qty: 1,
}

beforeEach(() => {
  document.cookie = `gally_cart=${encodeURIComponent(JSON.stringify([line]))}; path=/`
})

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'jane@example.com' },
  })
  fireEvent.change(screen.getByLabelText('First name'), {
    target: { value: 'Jane' },
  })
  fireEvent.change(screen.getByLabelText('Last name'), {
    target: { value: 'Doe' },
  })
  fireEvent.change(screen.getByLabelText('Address'), {
    target: { value: '1 rue de Paris' },
  })
  fireEvent.change(screen.getByLabelText('City'), {
    target: { value: 'Paris' },
  })
  fireEvent.change(screen.getByLabelText('Postal code'), {
    target: { value: '75001' },
  })
  fireEvent.change(screen.getByLabelText('Card number'), {
    target: { value: '4242 4242 4242 4242' },
  })
  fireEvent.change(screen.getByLabelText('Expiry'), {
    target: { value: '12/30' },
  })
  fireEvent.change(screen.getByLabelText('CVV'), { target: { value: '123' } })
}

describe('CheckoutPage', () => {
  it('shows the order summary with the cart contents', () => {
    renderWithProviders(<CheckoutPage />)
    expect(
      screen.getByRole('heading', { name: 'Checkout' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Carina Cardigan')).toBeInTheDocument()
  })

  it('places the order and clears the cart', () => {
    renderWithProviders(<CheckoutPage />)
    fillRequiredFields()
    fireEvent.click(screen.getByRole('button', { name: 'Place order' }))

    expect(document.cookie).toContain('gally_cart=%5B%5D')
  })
})
