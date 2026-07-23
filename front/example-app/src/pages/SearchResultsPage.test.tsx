import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { SearchResultsPage } from './SearchResultsPage'

describe('SearchResultsPage', () => {
  it('shows product results by default', () => {
    renderWithProviders(<SearchResultsPage />, { route: '/search?q=robe' })

    expect(screen.getByText(/Search results for/)).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Products/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getAllByTestId('product-card').length).toBeGreaterThan(0)
  })

  it('shows matching CMS pages when switching tabs', () => {
    renderWithProviders(<SearchResultsPage />, { route: '/search?q=gilet' })

    fireEvent.click(screen.getByRole('tab', { name: /CMS pages/ }))
    expect(screen.getByRole('tab', { name: /CMS pages/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getAllByTestId('article-card').length).toBeGreaterThan(0)
    expect(screen.getByText('Section')).toBeInTheDocument()
  })
})
