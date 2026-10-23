// The catalog switch from the client: which URL it navigates to, and when it marks the
// navigation with ?from=. See specs/test-plan-shared-state.md, part B.
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({ pathname: '/com_fr', push: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: () => fake.pathname,
  useRouter: () => ({ push: fake.push }),
}))
vi.mock('next/link', () => ({ useLinkStatus: () => ({ pending: false }) }))

import { CatalogProvider, useCatalog } from '../contexts/CatalogContext'
import { NavigationProvider } from '../contexts/NavigationContext'
import { findLocalizedCatalog } from '../sdk/catalogs'
import { CATALOGS } from './fixtures'

function wrapperFor(locale: string) {
  const resolved = findLocalizedCatalog(CATALOGS, locale)!
  return function Providers({ children }: { children: ReactNode }) {
    return (
      <NavigationProvider>
        <CatalogProvider
          catalogs={CATALOGS}
          selectedCatalog={resolved.catalog}
          selectedLocalizedCatalog={resolved.localizedCatalog}
          categories={[]}
        >
          {children}
        </CatalogProvider>
      </NavigationProvider>
    )
  }
}

const catalogAt = (pathname: string, locale = 'com_fr') => {
  fake.pathname = pathname
  return renderHook(() => useCatalog(), { wrapper: wrapperFor(locale) }).result
    .current
}

beforeEach(() => {
  fake.push.mockReset()
})

describe('switching localized catalog (feature-catalog-switch-missing-target)', () => {
  it.each([
    [
      'a category',
      '/com_fr/category/cat_1',
      '/com_en/category/cat_1?from=com_fr',
    ],
    ['a product', '/com_fr/product/VA02', '/com_en/product/VA02?from=com_fr'],
    ['a blog article', '/com_fr/blog/9', '/com_en/blog/9?from=com_fr'],
    ['the blog list', '/com_fr/blog', '/com_en/blog'],
    ['the homepage', '/com_fr', '/com_en'],
    ['the cart', '/com_fr/cart', '/com_en/cart'],
    // Decided 2026-10-22: the query is dropped on purpose, results differ per catalog.
    ['the search page', '/com_fr/search', '/com_en/search'],
  ])('from %s', (_name, from, to) => {
    catalogAt(from).setLocalizedCatalog('com_en')
    expect(fake.push).toHaveBeenCalledWith(to)
  })
})

describe('setCatalog', () => {
  it("goes to the catalog's default localized catalog, or its first one", () => {
    catalogAt('/com_fr/category/cat_1').setCatalog('fr')
    // The fixture `fr` catalog has no isDefault entry, so its first one, fr_fr.
    expect(fake.push).toHaveBeenCalledWith('/fr_fr/category/cat_1?from=com_fr')
    fake.push.mockReset()
    catalogAt('/fr_fr', 'fr_fr').setCatalog('com')
    expect(fake.push).toHaveBeenCalledWith('/com_fr')
  })

  it('does nothing for an unknown catalog', () => {
    catalogAt('/com_fr').setCatalog('nope')
    expect(fake.push).not.toHaveBeenCalled()
  })
})

describe('catalog values', () => {
  it('formats prices in the catalog locale and currency, and names its language', () => {
    const fr = catalogAt('/com_fr')
    expect(fr.formatPrice(12.5)).toMatch(/^12,50\s€$/u)
    expect(fr.activeLanguage).toBe('fr')
    const en = catalogAt('/com_en', 'com_en')
    expect(en.formatPrice(12.5)).toBe('€12.50')
    expect(en.activeLanguage).toBe('en')
  })
})
