// The story companion sends no search request, whatever the step - decided "for now"
// (specs/bugfix-story-companion-requests.md). Before, it sent an empty '*' search on every page.
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({ search: vi.fn(), push: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: () => '/com_fr',
  useRouter: () => ({ push: fake.push }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  getSearchManager: () => ({ search: fake.search }),
}))

import '../i18n'
import { CatalogProvider } from '../contexts/CatalogContext'
import { LocaleProvider } from '../contexts/LocaleContext'
import { SearchBarProvider } from '../contexts/SearchBarContext'
import { useStoryActions } from '../hooks/useStoryActions'
import demoDress from '../scenarios/demo-dress'
import { findLocalizedCatalog } from '../sdk/catalogs'
import { CATALOGS, CATEGORY_TREE } from './fixtures'

const comFr = findLocalizedCatalog(CATALOGS, 'com_fr')!

function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider locale="com_fr">
      <CatalogProvider
        catalogs={CATALOGS}
        selectedCatalog={comFr.catalog}
        selectedLocalizedCatalog={comFr.localizedCatalog}
        categories={CATEGORY_TREE}
      >
        <SearchBarProvider>{children}</SearchBarProvider>
      </CatalogProvider>
    </LocaleProvider>
  )
}

const addToCartStep = demoDress.steps.find(
  (s) => s.action.type === 'add_to_cart_flow'
)!

beforeEach(() => {
  fake.search.mockReset()
  fake.push.mockReset()
})
afterEach(() => {
  vi.useRealTimers()
})

describe('story companion requests', () => {
  it('sends nothing with no story running', async () => {
    renderHook(
      () => useStoryActions({ step: null, active: false, minimized: false }),
      { wrapper: Providers }
    )
    await act(async () => {})
    expect(fake.search).not.toHaveBeenCalled()
  })

  it('sends nothing on the add-to-cart step either, which falls back to the cart', async () => {
    vi.useFakeTimers()
    renderHook(
      () =>
        useStoryActions({
          step: addToCartStep,
          active: true,
          minimized: false,
        }),
      { wrapper: Providers }
    )
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000)
    })
    expect(fake.search).not.toHaveBeenCalled()
    // No prefetched products: after its retries the step goes to the cart.
    expect(fake.push).toHaveBeenLastCalledWith('/com_fr/cart')
  })
})
