import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { CategoryPage } from './CategoryPage'

describe('CategoryPage', () => {
  it('renders the category title, facets and products', () => {
    renderWithProviders(<CategoryPage />, {
      route: '/category/sweats',
      path: '/category/:slug',
    })

    expect(screen.getByRole('heading', { name: 'Sweats' })).toBeInTheDocument()
    expect(screen.getByText('Size')).toBeInTheDocument()
    expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0)
  })

  it('shows a message for an unknown category', () => {
    renderWithProviders(<CategoryPage />, {
      route: '/category/does-not-exist',
      path: '/category/:slug',
    })
    expect(screen.getByText('Category not found.')).toBeInTheDocument()
  })
})
