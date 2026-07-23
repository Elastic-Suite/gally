import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the hero and product carousels', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('New arrivals')).toBeInTheDocument()
    expect(screen.getByText("Editor's picks")).toBeInTheDocument()
    expect(screen.getByText('Most popular')).toBeInTheDocument()
    expect(screen.getByText('L’article du mois')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Lookbook' }),
    ).toBeInTheDocument()
  })
})
