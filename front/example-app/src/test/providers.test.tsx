// app/providers.tsx, rendered for real with AppShell stubbed: every context a page uses is reachable
// from the page, in the order that matters. The route tests replace Providers with a stub, so this
// is the only test that runs it. See specs/chore-vitest-setup.md.
import { act, render } from '@testing-library/react'
import { useEffect, type ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({ setBundles: vi.fn(), track: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: () => '/com_fr',
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock('../sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../sdk')>()),
  setBundles: fake.setBundles,
  getTracker: () => ({ push: fake.track }),
}))
vi.mock('../components/AppShell', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

import i18n from '../i18n'
import Providers from '../../app/providers'
import { useAxisLabel } from '../contexts/AxisLabelContext'
import { useCart } from '../contexts/CartContext'
import { useCatalog } from '../contexts/CatalogContext'
import { useGallyConfig } from '../contexts/ConfigContext'
import { useDemo } from '../contexts/DemoContext'
import { useEventLog } from '../contexts/EventLogContext'
import { useLocale } from '../contexts/LocaleContext'
import { useNavigationPending } from '../contexts/NavigationContext'
import { useSearchBarRef } from '../contexts/SearchBarContext'
import { findLocalizedCatalog } from '../sdk/catalogs'
import { CATALOGS, CATEGORY_TREE } from './fixtures'

const comFr = findLocalizedCatalog(CATALOGS, 'com_fr')!

type Seen = {
  locale: string
  catalog: string
  config: unknown
  axis: string
  cart: ReturnType<typeof useCart>
  log: ReturnType<typeof useEventLog>
}

// A page: uses every context, as page content does. A missing provider would throw here.
// What the page saw, written in an effect (writing outside during render, or to a prop, breaks the
// react-hooks rules).
const seen: { current?: Seen } = {}

function Page() {
  const locale = useLocale()
  const { selectedLocalizedCatalog } = useCatalog()
  const config = useGallyConfig()
  const axisLabel = useAxisLabel()
  const cart = useCart()
  const log = useEventLog()
  useDemo()
  useSearchBarRef()
  useNavigationPending()
  useEffect(() => {
    seen.current = {
      locale,
      catalog: selectedLocalizedCatalog?.code ?? '',
      config,
      axis: axisLabel('fashion_color'),
      cart,
      log,
    }
  })
  return null
}

function renderProviders() {
  seen.current = undefined
  render(
    <Providers
      locale="com_fr"
      catalogs={CATALOGS}
      selectedCatalog={comFr.catalog}
      selectedLocalizedCatalog={comFr.localizedCatalog}
      categories={CATEGORY_TREE}
      axisLabels={{ fashion_color: 'Couleur' }}
      config={{ 'gally.base_url.media': 'https://media.test/' }}
      bundles={['GallyPremiumBundle']}
    >
      <Page />
    </Providers>
  )
  return seen
}

afterEach(async () => {
  window.localStorage.clear()
  await i18n.changeLanguage('en')
})

describe('app/providers.tsx', () => {
  it('gives the page every context, with the values it was given', () => {
    const seen = renderProviders()
    expect(seen.current).toMatchObject({
      locale: 'com_fr',
      catalog: 'com_fr',
      config: { 'gally.base_url.media': 'https://media.test/' },
      axis: 'Couleur',
    })
  })

  it('hands the bundles to the SDK and switches the language to the catalog', () => {
    renderProviders()
    expect(fake.setBundles).toHaveBeenCalledWith(['GallyPremiumBundle'])
    expect(i18n.language).toBe('fr')
  })

  it('the cart writes to the same event log the page reads (bugfix-add-to-cart-event-log)', async () => {
    const seen = renderProviders()
    await act(async () => {})
    act(() =>
      seen.current!.cart.addToCart({ sku: 'VA02', name: 'Scarf', price: 48 })
    )
    expect(seen.current!.log.entries.map((e) => e.type)).toEqual([
      'ADD_TO_CART',
    ])
  })
})
