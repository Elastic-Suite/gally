import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { SearchAutocomplete } from './SearchAutocomplete'

describe('SearchAutocomplete', () => {
  it('shows suggested search terms while typing', async () => {
    renderWithProviders(<SearchAutocomplete />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search' }), {
      target: { value: 'sweat' },
    })

    expect(await screen.findByText('Suggested searches')).toBeInTheDocument()
  })
})
