// The facet sidebar, rendered with its props and driven like a visitor: what shows, and what
// onFilterChange receives. See specs/test-plan-facets.md.
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import '../i18n'
import Facets from '../components/Facets'

type Props = ComponentProps<typeof Facets>
type Agg = Props['aggregations'][number]
type Option = Agg['options'][number]

const opt = (value: string, label = value, count = 1): Option => ({
  value,
  label,
  count,
})
const agg = (
  field: string,
  label: string,
  type: string,
  options: Option[],
  extra: Partial<Agg> = {}
): Agg => ({ field, label, type, options, ...extra })

const COLOR = agg('fashion_color__value', 'Color', 'checkbox', [
  opt('5', 'Red'),
  opt('7', 'Blue'),
])
const SIZE = agg('fashion_size__value', 'Size', 'checkbox', [
  opt('33', 'S'),
  opt('34', 'M'),
])
const CATEGORY = agg('category__id', 'Category', 'category', [
  opt('cat_10', 'Sweaters'),
  opt('cat_11', 'Tops'),
])
const ECO = agg('llv_is_eco', 'Eco', 'boolean', [
  opt('1', 'Yes'),
  opt('0', 'No'),
])
const PRICE = agg('price__price', 'Price', 'slider', [
  opt('10'),
  opt('50'),
  opt('100'),
])

function renderFacets(props: Partial<Props> = {}) {
  const onFilterChange = vi.fn()
  const view = render(
    <Facets
      aggregations={[]}
      activeFilters={{}}
      onFilterChange={onFilterChange}
      resultCount={10}
      {...props}
    />
  )
  const rerender = (next: Partial<Props>) =>
    view.rerender(
      <Facets
        aggregations={[]}
        activeFilters={{}}
        onFilterChange={onFilterChange}
        resultCount={10}
        {...props}
        {...next}
      />
    )
  return { ...view, onFilterChange, rerender }
}

const titles = (container: HTMLElement) =>
  [...container.querySelectorAll('.facet-title')].map((t) => t.textContent)
const chips = () =>
  screen
    .queryAllByRole('button')
    .filter((b) => b.className === 'filter-chip')
    .map((b) => b.textContent?.trim())

afterEach(() => {
  vi.useRealTimers()
})

describe('A - which facets show (feature-facet-hide-single-value, feature-facet-empty-state)', () => {
  it('hides facets with 0 or 1 option, whatever their type, and never shows name', () => {
    const { container } = renderFacets({
      aggregations: [
        COLOR,
        agg('fashion_size__value', 'Size', 'checkbox', [opt('33')]),
        agg('category__id', 'Category', 'category', []),
        agg('name', 'Name', 'checkbox', [opt('a'), opt('b')]),
      ],
    })
    expect(titles(container)).toEqual(['Color'])
  })

  it('shows the skeleton while loading with nothing to show, never the empty message', () => {
    const { container } = renderFacets({ loading: true, resultCount: 0 })
    expect(container.querySelector('.skeleton')).not.toBeNull()
    expect(container.querySelector('.facets-empty')).toBeNull()
  })

  it.each<[string, Partial<Props>, string]>([
    ['no result, no filter', { resultCount: 0 }, 'nothing matched this search'],
    [
      'no result with filters',
      { resultCount: 0, activeFilters: { a: '1' } },
      'Remove one above',
    ],
    [
      'several results, nothing to tell apart',
      { resultCount: 5 },
      'All 5 results share',
    ],
    ['one result', { resultCount: 1 }, 'Only one result'],
  ])('settled with nothing to show: %s', (_name, props, text) => {
    renderFacets(props)
    expect(screen.getByText(new RegExp(text))).toBeInTheDocument()
  })

  it('shows the close button only with onClose, and passes open to the sidebar', async () => {
    const onClose = vi.fn()
    const { container, rerender } = renderFacets({ aggregations: [COLOR] })
    expect(container.querySelector('.facets-drawer-close')).toBeNull()
    rerender({ onClose, open: true })
    await userEvent.click(container.querySelector('.facets-drawer-close')!)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(container.querySelector('aside')).toHaveClass('open')
  })
})

describe('B - what each facet type sends', () => {
  it('checkbox: tick adds to the list, unticking the last gives undefined', async () => {
    // A field without "color" in its name: drawn as checkboxes, not swatches.
    const { onFilterChange, rerender } = renderFacets({
      aggregations: [SIZE],
      activeFilters: { fashion_size__value: ['33'] },
    })
    await userEvent.click(screen.getByRole('checkbox', { name: /^M/ }))
    expect(onFilterChange).toHaveBeenLastCalledWith('fashion_size__value', [
      '33',
      '34',
    ])
    rerender({ activeFilters: { fashion_size__value: ['33'] } })
    await userEvent.click(screen.getByRole('checkbox', { name: /^S/ }))
    expect(onFilterChange).toHaveBeenLastCalledWith(
      'fashion_size__value',
      undefined
    )
  })

  it('colour swatch: a named toggle button, reachable with the keyboard (bugfix-facet-swatches-keyboard)', async () => {
    const swatches = agg('fashion_color__value', 'Colour', 'checkbox', [
      opt('5', 'Red'),
      opt('7', 'Blue'),
    ])
    // A field containing "color" is drawn as swatches.
    const { onFilterChange } = renderFacets({
      aggregations: [{ ...swatches, field: 'fashion_color' }],
      activeFilters: { fashion_color: ['7'] },
    })
    const red = screen.getByRole('button', { name: 'Red' })
    expect(red).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Blue' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(red).toHaveAttribute('title', 'Red (1)')
    const user = userEvent.setup()
    red.focus()
    await user.keyboard('{Enter}')
    expect(onFilterChange).toHaveBeenLastCalledWith('fashion_color', ['7', '5'])
    await user.keyboard(' ')
    expect(onFilterChange).toHaveBeenCalledTimes(2)
  })

  it('category: one value at a time; ticking it again gives undefined (feature-facet-category)', async () => {
    const { onFilterChange, rerender } = renderFacets({
      aggregations: [CATEGORY],
    })
    await userEvent.click(screen.getByRole('checkbox', { name: /^Sweaters/ }))
    expect(onFilterChange).toHaveBeenLastCalledWith('category__id', 'cat_10')
    rerender({ activeFilters: { category__id: 'cat_10' } })
    await userEvent.click(screen.getByRole('checkbox', { name: /^Sweaters/ }))
    expect(onFilterChange).toHaveBeenLastCalledWith('category__id', undefined)
  })

  it('yes/no: true, then undefined', async () => {
    const { onFilterChange, rerender } = renderFacets({ aggregations: [ECO] })
    await userEvent.click(screen.getByRole('checkbox', { name: 'Yes' }))
    expect(onFilterChange).toHaveBeenLastCalledWith('llv_is_eco', true)
    rerender({ activeFilters: { llv_is_eco: true } })
    await userEvent.click(screen.getByRole('checkbox', { name: 'Yes' }))
    expect(onFilterChange).toHaveBeenLastCalledWith('llv_is_eco', undefined)
  })
})

describe('B - the price slider (feature-facet-price-slider-sync)', () => {
  const handles = () => screen.getAllByRole('slider') as HTMLInputElement[]

  it('takes its bounds from the first and last option', () => {
    renderFacets({ aggregations: [PRICE] })
    expect(handles().map((h) => [h.min, h.max, h.value])).toEqual([
      ['10', '100', '10'],
      ['10', '100', '100'],
    ])
  })

  it('names each handle from the facet label (bugfix-facet-show-more-and-slider-names)', () => {
    renderFacets({ aggregations: [PRICE] })
    expect(screen.getByRole('slider', { name: 'Minimum Price' })).toHaveValue(
      '10'
    )
    expect(screen.getByRole('slider', { name: 'Maximum Price' })).toHaveValue(
      '100'
    )
  })

  it('"Show more" is reachable with the keyboard', async () => {
    const options = ['a', 'b', 'c', 'd', 'e', 'f'].map((v) => opt(v))
    renderFacets({
      aggregations: [agg('material', 'Material', 'checkbox', options)],
    })
    const more = screen.getByRole('button', { name: /Show more/ })
    more.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getAllByRole('checkbox')).toHaveLength(6)
  })

  it('sends { gte, lte } 400 ms after the last move, never before', () => {
    vi.useFakeTimers()
    const { onFilterChange } = renderFacets({ aggregations: [PRICE] })
    fireEvent.change(handles()[0], { target: { value: '20' } })
    fireEvent.change(handles()[1], { target: { value: '60' } })
    act(() => vi.advanceTimersByTime(399))
    expect(onFilterChange).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onFilterChange.mock.calls).toEqual([
      ['price__price', { gte: 20, lte: 60 }],
    ])
  })

  it('keeps the handles one unit apart', () => {
    vi.useFakeTimers()
    const { onFilterChange } = renderFacets({ aggregations: [PRICE] })
    fireEvent.change(handles()[0], { target: { value: '100' } })
    act(() => vi.advanceTimersByTime(400))
    expect(onFilterChange).toHaveBeenLastCalledWith('price__price', {
      gte: 99,
      lte: 100,
    })
  })

  it('re-syncs to new bounds or a new active range, clamped', () => {
    const { rerender } = renderFacets({ aggregations: [PRICE] })
    rerender({
      aggregations: [{ ...PRICE, options: [opt('20'), opt('80')] }],
      activeFilters: { price__price: { gte: 5, lte: 60 } },
    })
    expect(handles().map((h) => h.value)).toEqual(['20', '60'])
  })

  it('draws the full width when the range is empty', () => {
    const { container } = renderFacets({
      aggregations: [{ ...PRICE, options: [opt('50'), opt('50')] }],
    })
    const fill = container.querySelector(
      '.price-slider-track-active'
    ) as HTMLElement
    expect(fill.style.left).toBe('0%')
    expect(fill.style.width).toBe('100%')
  })

  it('still commits a move made just before it unmounts (pinned as today)', () => {
    vi.useFakeTimers()
    const { onFilterChange, unmount } = renderFacets({ aggregations: [PRICE] })
    fireEvent.change(handles()[0], { target: { value: '30' } })
    unmount()
    act(() => vi.advanceTimersByTime(400))
    expect(onFilterChange).toHaveBeenCalledWith('price__price', {
      gte: 30,
      lte: 100,
    })
  })
})

describe('C - show more and option search (feature-facet-load-more)', () => {
  const seven = agg(
    'material',
    'Material',
    'checkbox',
    ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((v) =>
      opt(v, `Mat ${v.toUpperCase()}`)
    )
  )
  // The label text, without the count that follows it.
  const boxes = () =>
    screen
      .getAllByRole('checkbox')
      .map((c) => c.closest('label')?.querySelector('span')?.textContent)

  it('shows 5, then "Show more (2)", then all, then folds back with "Show less"', async () => {
    renderFacets({ aggregations: [seven] })
    expect(boxes()).toHaveLength(5)
    // Real buttons (bugfix-facet-show-more-and-slider-names).
    await userEvent.click(
      screen.getByRole('button', { name: /Show more \(2\)/ })
    )
    expect(boxes()).toHaveLength(7)
    await userEvent.click(screen.getByRole('button', { name: /Show less/ }))
    expect(boxes()).toHaveLength(5)
  })

  it('asks the server once when the API has more, and shows what comes back', async () => {
    const onLoadMore = vi
      .fn()
      .mockResolvedValue([opt('x', 'Mat X'), opt('y', 'Mat Y')])
    renderFacets({ aggregations: [{ ...seven, hasMore: true }], onLoadMore })
    await userEvent.click(screen.getByRole('button', { name: /Show more$/ }))
    expect(onLoadMore.mock.calls).toEqual([['material']])
    expect(boxes()).toEqual(['Mat X', 'Mat Y'])
  })

  it('never asks the server when everything is already local', async () => {
    const onLoadMore = vi.fn()
    renderFacets({ aggregations: [seven], onLoadMore })
    await userEvent.click(screen.getByRole('button', { name: /Show more/ }))
    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('shows the search box from 6 options, and filters by label', async () => {
    const five = { ...seven, options: seven.options.slice(0, 5) }
    const { rerender } = renderFacets({ aggregations: [five] })
    expect(screen.queryByPlaceholderText('Search material…')).toBeNull()
    rerender({
      aggregations: [{ ...seven, options: seven.options.slice(0, 6) }],
    })
    await userEvent.type(
      screen.getByPlaceholderText('Search material…'),
      'mat b'
    )
    expect(boxes()).toEqual(['Mat B'])
  })

  it('asks the server 300 ms after typing, and drops an answer for an older term', async () => {
    vi.useFakeTimers()
    const answers: Record<string, (o: Option[]) => void> = {}
    const onLoadMore = vi.fn(
      (_field: string, term?: string) =>
        new Promise<Option[]>((resolve) => (answers[term ?? ''] = resolve))
    )
    renderFacets({ aggregations: [{ ...seven, hasMore: true }], onLoadMore })
    const box = screen.getByPlaceholderText('Search material…')
    fireEvent.change(box, { target: { value: 'mat' } })
    expect(onLoadMore).not.toHaveBeenCalled()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(onLoadMore).toHaveBeenLastCalledWith('material', 'mat')
    fireEvent.change(box, { target: { value: 'mat z' } })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(onLoadMore).toHaveBeenLastCalledWith('material', 'mat z')
    await act(async () => answers['mat z']([opt('z', 'Mat Z')]))
    await act(async () => answers['mat']([opt('q', 'Mat Q')]))
    expect(boxes()).toEqual(['Mat Z'])
  })
})

describe('D - active-filter chips (feature-facet-active-filters)', () => {
  it('no chip without a value; one per selected value, one per range, a yes/no shows its name', () => {
    renderFacets({
      aggregations: [COLOR, PRICE, ECO],
      activeFilters: {
        fashion_color__value: ['5', '7'],
        price__price: { gte: 10, lte: 50 },
        llv_is_eco: true,
        unset: undefined,
      },
    })
    expect(chips()).toEqual([
      'Color: Red',
      'Color: Blue',
      'Price: 10–50',
      'Eco',
    ])
  })

  it('a chip removes only its value; the last value or a range clears the field', async () => {
    const { onFilterChange } = renderFacets({
      aggregations: [COLOR, PRICE],
      activeFilters: {
        fashion_color__value: ['5', '7'],
        price__price: { gte: 10, lte: 50 },
      },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Color: Red' }))
    expect(onFilterChange).toHaveBeenLastCalledWith('fashion_color__value', [
      '7',
    ])
    await userEvent.click(screen.getByRole('button', { name: 'Price: 10–50' }))
    expect(onFilterChange).toHaveBeenLastCalledWith('price__price', undefined)
  })

  it('"Clear all" shows from 2 chips and clears each field once', async () => {
    const { onFilterChange, rerender } = renderFacets({
      aggregations: [COLOR, SIZE],
      activeFilters: { fashion_color__value: ['5'] },
    })
    expect(screen.queryByRole('button', { name: 'Clear all' })).toBeNull()
    // Exactly two chips: the threshold the spec names.
    rerender({
      activeFilters: {
        fashion_color__value: ['5'],
        fashion_size__value: ['33'],
      },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(onFilterChange.mock.calls).toEqual([
      ['fashion_color__value', undefined],
      ['fashion_size__value', undefined],
    ])
  })
})

describe('D - chip labels (bugfix-facet-chip-labels-lost)', () => {
  const onlySweaters = agg('category__id', 'Category', 'category', [
    opt('cat_10', 'Sweaters'),
  ])

  it('names the chip of a facet hidden for having one option', () => {
    const { container } = renderFacets({
      aggregations: [onlySweaters, COLOR],
      activeFilters: { category__id: 'cat_10' },
    })
    expect(titles(container)).toEqual(['Color'])
    expect(chips()).toEqual(['Category: Sweaters'])
  })

  it('remembers the label when the facet leaves the response; the current response wins', () => {
    const { rerender } = renderFacets({
      aggregations: [CATEGORY],
      activeFilters: { category__id: 'cat_10' },
    })
    rerender({ aggregations: [COLOR] })
    expect(chips()).toEqual(['Category: Sweaters'])
    rerender({
      aggregations: [
        agg('category__id', 'Rayon', 'category', [opt('cat_10', 'Pulls')]),
      ],
    })
    expect(chips()).toEqual(['Rayon: Pulls'])
  })

  it('falls back to the raw code for a value never seen', () => {
    renderFacets({ activeFilters: { category__id: 'cat_99' } })
    expect(chips()).toEqual(['category__id: cat_99'])
  })
})
