import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { BlogIndexPage } from './BlogIndexPage'

describe('BlogIndexPage', () => {
  it('lists blog sections and articles', () => {
    renderWithProviders(<BlogIndexPage />)
    expect(screen.getByRole('heading', { name: 'Blogs' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Guides style' }),
    ).toBeInTheDocument()
  })
})
