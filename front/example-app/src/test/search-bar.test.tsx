// The search bar and its autocomplete panel, rendered with fake autocomplete data and a fake router,
// driven with the keyboard and the mouse; the combobox semantics checked by role, as assistive
// technology sees them. See specs/test-plan-search-bar.md and bugfix-autocomplete-screen-reader.md.
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { useEffect, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  pathname: '/com_fr',
  push: vi.fn(),
  products: {
    results: [] as unknown[],
    aggregations: [] as unknown[],
    termSuggestions: [] as { term: string }[],
    loading: false,
    search: vi.fn(),
    clear: vi.fn(),
  },
  blog: {
    pages: [] as unknown[],
    termSuggestions: [] as { term: string }[],
    loading: false,
    search: vi.fn(),
    clear: vi.fn(),
  },
}))

vi.mock('next/navigation', () => ({
  usePathname: () => fake.pathname,
  useRouter: () => ({ push: fake.push }),
}))
vi.mock('../hooks/useSearch', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../hooks/useSearch')>()),
  useAutocomplete: () => fake.products,
}))
vi.mock('../hooks/useCms', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../hooks/useCms')>()),
  useCmsAutocomplete: () => fake.blog,
}))
vi.mock('../contexts/CartContext', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../contexts/CartContext')>()),
  useCart: () => ({ addToCart: vi.fn() }),
}))

import '../i18n'
import SearchBar from '../components/SearchBar'
import { acpOptionId } from '../components/SearchOverlay'
import { CatalogProvider } from '../contexts/CatalogContext'
import { LocaleProvider } from '../contexts/LocaleContext'
import {
  SearchBarProvider,
  useSearchBarRef,
} from '../contexts/SearchBarContext'
import { findLocalizedCatalog } from '../sdk/catalogs'
import { CATALOGS, CATEGORY_TREE } from './fixtures'
import { SIMPLE_LISTING } from './fixtures/api'

const comFr = findLocalizedCatalog(CATALOGS, 'com_fr')!
const handle: { current: ReturnType<typeof useSearchBarRef> | null } = {
  current: null,
}

function HandleProbe() {
  const ref = useSearchBarRef()
  // In an effect: writing outside during render breaks the react-hooks rules.
  useEffect(() => {
    handle.current = ref
  })
  return null
}

function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider locale="com_fr">
      <CatalogProvider
        catalogs={CATALOGS}
        selectedCatalog={comFr.catalog}
        selectedLocalizedCatalog={comFr.localizedCatalog}
        categories={CATEGORY_TREE}
      >
        <SearchBarProvider>
          {children}
          <HandleProbe />
        </SearchBarProvider>
      </CatalogProvider>
    </LocaleProvider>
  )
}

const renderBar = () =>
  render(<SearchBar categories={CATEGORY_TREE} categoriesLoading={false} />, {
    wrapper: Providers,
  })
const input = () => screen.getByRole('combobox', { name: 'Search the shop' })
const type = (value: string) => {
  fireEvent.focus(input())
  fireEvent.change(input(), { target: { value } })
}
const key = (k: string) => fireEvent.keyDown(input(), { key: k })
const optionNames = (listbox: string) =>
  within(screen.getByRole('listbox', { name: listbox }))
    .queryAllByRole('option')
    .map((o) => o.getAttribute('aria-label') ?? o.textContent?.trim())

beforeEach(() => {
  // jsdom has no matchMedia; the bar asks it about the phone layout. A desktop-width screen.
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    media: '',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })
  // jsdom has no scrollIntoView; the bar keeps the highlighted row in view with it.
  Element.prototype.scrollIntoView = vi.fn()
  fake.pathname = '/com_fr'
  fake.push.mockReset()
  Object.assign(fake.products, {
    results: [SIMPLE_LISTING],
    aggregations: [
      {
        field: 'color',
        label: 'Color',
        type: 'checkbox',
        options: ['5', '6', '7', '8', '9', '10'].map((v) => ({
          value: v,
          label: `C${v}`,
          count: 1,
        })),
      },
      {
        field: 'name',
        label: 'Name',
        type: 'checkbox',
        options: [{ value: 'x', label: 'X', count: 1 }],
      },
      {
        field: 'price',
        label: 'Price',
        type: 'slider',
        options: [{ value: '1', label: '1', count: 1 }],
      },
    ],
    termSuggestions: [{ term: 'robe' }, { term: 'jupe' }],
    loading: false,
  })
  Object.assign(fake.blog, {
    pages: [
      { id: '9', title: 'Dress care guide', summary: '', image: '', tags: [] },
    ],
    termSuggestions: [{ term: 'jupe' }, { term: 'blog term' }],
    loading: false,
  })
  for (const f of [
    fake.products.search,
    fake.products.clear,
    fake.blog.search,
    fake.blog.clear,
  ])
    f.mockReset()
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})
afterEach(() => {
  vi.useRealTimers()
})

describe('the combobox semantics (bugfix-autocomplete-screen-reader)', () => {
  it('the input is a named combobox, collapsed under 2 characters', () => {
    renderBar()
    type('r')
    expect(input()).toHaveAttribute('aria-autocomplete', 'list')
    expect(input()).toHaveAttribute('aria-expanded', 'false')
    expect(input()).not.toHaveAttribute('aria-controls')
    expect(screen.queryAllByRole('listbox')).toHaveLength(0)
  })

  it('from 2 characters it is expanded and controls three named listboxes that exist', () => {
    renderBar()
    type('dre')
    expect(input()).toHaveAttribute('aria-expanded', 'true')
    const ids = input().getAttribute('aria-controls')!.split(' ')
    expect(ids).toHaveLength(3)
    for (const id of ids)
      expect(document.getElementById(id)).toHaveAttribute('role', 'listbox')
    expect(
      screen.getAllByRole('listbox').map((l) => l.getAttribute('aria-label'))
    ).toEqual(['Suggestions', 'Products', 'Blog'])
  })

  it('the keyboard highlight is announced: aria-activedescendant points at the selected option', () => {
    renderBar()
    type('dre')
    expect(input()).not.toHaveAttribute('aria-activedescendant')
    key('ArrowDown')
    const id = input().getAttribute('aria-activedescendant')!
    expect(id).toBe(acpOptionId('suggestion-robe'))
    const option = document.getElementById(id)!
    expect(option).toHaveAttribute('role', 'option')
    expect(option).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('option', { selected: true })).toHaveLength(1)
  })
})

describe('A - the search bar', () => {
  it('typing feeds both autocompletes', () => {
    renderBar()
    type('ro')
    expect(fake.products.search).toHaveBeenLastCalledWith('ro')
    expect(fake.blog.search).toHaveBeenLastCalledWith('ro')
  })

  it('focus opens the panel; blur closes it after 200 ms, so a click on a row still lands', () => {
    vi.useFakeTimers()
    renderBar()
    type('dre')
    expect(screen.getAllByRole('listbox')).toHaveLength(3)
    fireEvent.blur(input())
    act(() => vi.advanceTimersByTime(199))
    expect(screen.getAllByRole('listbox')).toHaveLength(3)
    act(() => vi.advanceTimersByTime(1))
    expect(screen.queryAllByRole('listbox')).toHaveLength(0)
  })

  it('submit goes to /search with the trimmed, encoded query; a blank query does nothing', () => {
    renderBar()
    type('   ')
    fireEvent.submit(input().closest('form')!)
    expect(fake.push).not.toHaveBeenCalled()
    type('  robe d ')
    fireEvent.submit(input().closest('form')!)
    expect(fake.push).toHaveBeenCalledWith('/com_fr/search?q=robe%20d')
    expect(fake.products.clear).toHaveBeenCalled()
    // The term stays in the box on /search; it is cleared when the visitor leaves /search.
    expect(input()).toHaveValue('  robe d ')
  })

  it('arrows: down to the first, up to the last, both wrap; nothing under 2 characters', () => {
    renderBar()
    type('d')
    key('ArrowDown')
    expect(input()).not.toHaveAttribute('aria-activedescendant')
    type('dre')
    key('ArrowUp')
    expect(input()).toHaveAttribute(
      'aria-activedescendant',
      acpOptionId('blog-9')
    )
    key('ArrowDown')
    expect(input()).toHaveAttribute(
      'aria-activedescendant',
      acpOptionId('suggestion-robe')
    )
  })

  it('Enter on a highlighted item goes to that item, not to the typed text', () => {
    renderBar()
    type('dre')
    key('ArrowDown')
    key('ArrowDown')
    key('Enter')
    expect(fake.push).toHaveBeenCalledWith('/com_fr/search?q=jupe')
  })

  it('leaving /search clears the query (bugfix-search-term-kept-after-leaving-search)', () => {
    fake.pathname = '/com_fr/search'
    const view = renderBar()
    type('robe')
    fake.pathname = '/com_fr/cart'
    view.rerender(
      <SearchBar categories={CATEGORY_TREE} categoriesLoading={false} />
    )
    expect(input()).toHaveValue('')
  })

  it("the guided demo's handle: setQuery searches without navigating, submit navigates, clear empties", () => {
    renderBar()
    act(() => handle.current!.current!.setQuery('robe'))
    expect(input()).toHaveValue('robe')
    expect(fake.products.search).toHaveBeenLastCalledWith('robe')
    expect(fake.push).not.toHaveBeenCalled()
    act(() => handle.current!.current!.submit())
    expect(fake.push).toHaveBeenCalledWith('/com_fr/search?q=robe')
    act(() => handle.current!.current!.setQuery('jupe'))
    act(() => handle.current!.current!.clear())
    expect(input()).toHaveValue('')
  })

  it('locks the page scroll while the panel is open, and restores it', () => {
    vi.useFakeTimers()
    renderBar()
    type('dre')
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.blur(input())
    act(() => vi.advanceTimersByTime(200))
    expect(document.body.style.overflow).toBe('')
  })
})

describe('B - the panel', () => {
  it('under 2 characters: the prompt only, no columns, no tabs (feature-acp-focus-empty-state)', () => {
    renderBar()
    type('r')
    expect(screen.getByText(/Start typing/)).toBeInTheDocument()
    expect(screen.queryByRole('tablist')).toBeNull()
  })

  it('terms: products first, then articles, without duplicates; a term opens its search', () => {
    renderBar()
    type('dre')
    const suggestions = optionNames('Suggestions')
    expect(suggestions.slice(0, 3)).toEqual(['robe', 'jupe', 'blog term'])
    fireEvent.click(screen.getByRole('option', { name: 'robe' }))
    expect(fake.push).toHaveBeenCalledWith('/com_fr/search?q=robe')
  })

  it('attributes: no name, no slider, 5 values at most, named with their attribute; a value opens f_ without q', () => {
    renderBar()
    type('dre')
    const attributes = optionNames('Suggestions').slice(3)
    expect(attributes).toEqual([
      'Color: C5',
      'Color: C6',
      'Color: C7',
      'Color: C8',
      'Color: C9',
    ])
    fireEvent.click(screen.getByRole('option', { name: 'Color: C6' }))
    expect(fake.push).toHaveBeenCalledWith('/com_fr/search?f_color=6')
  })

  it('products by name with their quick-add; categories matching the query; articles', () => {
    renderBar()
    type('dre')
    expect(optionNames('Products')).toEqual([
      'Snow White - illustrated picture book',
    ])
    const more = within(screen.getByRole('listbox', { name: 'Blog' }))
    expect(
      more.getAllByRole('option').map((o) => o.textContent?.trim())
    ).toEqual([
      'Dresses',
      'Long dresses',
      expect.stringContaining('Dress care guide'),
    ])
    fireEvent.click(
      screen.getByRole('option', {
        name: 'Snow White - illustrated picture book',
      })
    )
    expect(fake.push).toHaveBeenCalledWith('/com_fr/product/LLV-LIV-ALB-001')
  })

  it('each column: a skeleton while loading, a "no matching" note when empty', () => {
    fake.products.results = []
    fake.products.loading = true
    fake.blog.pages = []
    renderBar()
    type('zz')
    expect(
      document.querySelectorAll(
        '.search-overlay-col-products .skeleton, .search-overlay-col-products [class*="skeleton"]'
      ).length
    ).toBeGreaterThan(0)
    expect(screen.getByText('No matching articles')).toBeInTheDocument()
    expect(screen.getByText('No matching categories')).toBeInTheDocument()
  })

  it('mobile tabs: Products selected on open, the tab follows the highlight, tabs never take focus', () => {
    renderBar()
    type('dre')
    const tab = (name: string) => screen.getByRole('tab', { name })
    expect(tab('Products')).toHaveAttribute('aria-selected', 'true')
    for (const t of screen.getAllByRole('tab'))
      expect(t).toHaveAttribute('tabindex', '-1')
    key('ArrowDown')
    expect(tab('Suggestions')).toHaveAttribute('aria-selected', 'true')
  })
})
