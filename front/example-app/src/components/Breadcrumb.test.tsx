// Smoke test for the test setup itself (specs/chore-vitest-setup.md): one render that goes
// through TSX, jsdom, React 19, the real i18n files, the locale context and next/link.
// The Breadcrumb behaviour gets its own tests when its aspect is covered.
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import i18n from '../i18n'
import { LocaleProvider } from '../contexts/LocaleContext'
import Breadcrumb from './Breadcrumb'

describe('test setup smoke test', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders a translated component with locale-prefixed links', async () => {
    await i18n.changeLanguage('fr')

    render(
      <LocaleProvider locale="com_fr">
        <Breadcrumb
          parts={[{ name: 'Robes', href: '/category/1' }, { name: 'Rouge' }]}
        />
      </LocaleProvider>
    )

    expect(
      screen.getByRole('navigation', { name: "Fil d'Ariane" })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Accueil' })).toHaveAttribute(
      'href',
      '/com_fr'
    )
    expect(screen.getByRole('link', { name: 'Robes' })).toHaveAttribute(
      'href',
      '/com_fr/category/1'
    )
    expect(screen.getByText('Rouge')).toHaveAttribute('aria-current', 'page')
  })
})
