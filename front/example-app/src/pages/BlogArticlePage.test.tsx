import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { BlogArticlePage } from './BlogArticlePage'

describe('BlogArticlePage', () => {
  it('renders the article body and related products', () => {
    renderWithProviders(<BlogArticlePage />, {
      route: '/blogs/bien-choisir-son-gilet',
      path: '/blogs/:slug',
    })

    expect(screen.getByRole('heading', { name: /gilet/i })).toBeInTheDocument()
    expect(screen.getByText('Featured in this article')).toBeInTheDocument()
  })

  it('shows a message for an unknown article', () => {
    renderWithProviders(<BlogArticlePage />, {
      route: '/blogs/unknown',
      path: '/blogs/:slug',
    })
    expect(screen.getByText('Article not found.')).toBeInTheDocument()
  })
})
