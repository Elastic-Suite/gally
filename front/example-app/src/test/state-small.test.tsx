// Smaller shared state: the "added" flash, the guided demo, the event log, useMounted, and the
// hooks that must fail outside their provider. See specs/test-plan-shared-state.md, part E.
import { act, render, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  usePathname: () => '/com_fr',
  useRouter: () => ({ push: vi.fn() }),
}))

import { ADDED_FLASH_MS, useAddedFlash } from '../hooks/useAddedFlash'
import { DemoProvider, useDemo } from '../contexts/DemoContext'
import { EventLogProvider, useEventLog } from '../contexts/EventLogContext'
import { useMounted } from '../hooks/useMounted'
import { useLocale } from '../contexts/LocaleContext'
import { useSearchBarRef } from '../contexts/SearchBarContext'
import { useCart } from '../contexts/CartContext'
import { useCatalog } from '../contexts/CatalogContext'
import demoDress from '../scenarios/demo-dress'

describe('useAddedFlash (feature-add-to-cart-feedback-everywhere)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the added state for 1.6 s', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAddedFlash())
    expect(ADDED_FLASH_MS).toBe(1600)
    act(() => result.current.flash('VA02'))
    act(() => vi.advanceTimersByTime(1599))
    expect(result.current.addedKey).toBe('VA02')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.addedKey).toBeNull()
  })

  it('restarts on a second add', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAddedFlash())
    act(() => result.current.flash('VA02'))
    act(() => vi.advanceTimersByTime(1000))
    act(() => result.current.flash('VD10'))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.addedKey).toBe('VD10')
    act(() => vi.advanceTimersByTime(600))
    expect(result.current.addedKey).toBeNull()
  })

  it('leaves no timer behind on unmount', () => {
    vi.useFakeTimers()
    const { result, unmount } = renderHook(() => useAddedFlash())
    act(() => result.current.flash('VA02'))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('guided demo (feature-guided-demo-rebuild)', () => {
  const steps = demoDress.steps.length
  const demo = () =>
    renderHook(() => useDemo(), { wrapper: DemoProvider }).result

  it('starts with the intro seen, the direction audience and no story', () => {
    const d = demo()
    expect(d.current).toMatchObject({
      introSeen: true,
      audience: 'direction',
      storyActive: false,
      currentStory: null,
    })
  })

  it('walks the steps and stays within them', () => {
    const d = demo()
    act(() => d.current.startStory())
    expect(d.current.currentStory).toBe(demoDress.steps[0])
    for (let i = 0; i < steps + 2; i++) act(() => d.current.nextStep())
    expect(d.current.storyStep).toBe(steps - 1)
    for (let i = 0; i < steps + 2; i++) act(() => d.current.prevStep())
    expect(d.current.storyStep).toBe(0)
    act(() => d.current.jumpStep(99))
    expect(d.current.storyStep).toBe(steps - 1)
    act(() => d.current.jumpStep(-3))
    expect(d.current.storyStep).toBe(0)
  })

  it('moving to another step brings a minimised story back', () => {
    const d = demo()
    act(() => d.current.startStory())
    act(() => d.current.minimizeStory())
    expect(d.current.storyMinimized).toBe(true)
    act(() => d.current.nextStep())
    expect(d.current.storyMinimized).toBe(false)
  })

  it('skip ends the story', () => {
    const d = demo()
    act(() => d.current.startStory())
    act(() => d.current.skipStory())
    expect(d.current).toMatchObject({ storyActive: false, currentStory: null })
  })
})

describe('event log', () => {
  it('keeps the newest 50 entries, newest first', () => {
    const { result } = renderHook(() => useEventLog(), {
      wrapper: EventLogProvider,
    })
    act(() => {
      for (let i = 0; i < 55; i++) result.current.log('TEST', String(i))
    })
    expect(result.current.entries).toHaveLength(50)
    expect(result.current.entries[0].detail).toBe('54')
    expect(result.current.entries[49].detail).toBe('5')
  })

  it('is hidden until toggled', () => {
    const { result } = renderHook(() => useEventLog(), {
      wrapper: EventLogProvider,
    })
    expect(result.current.visible).toBe(false)
    act(() => result.current.toggleVisible())
    expect(result.current.visible).toBe(true)
  })
})

describe('useMounted', () => {
  it('is false on the first render and true after', () => {
    const values: boolean[] = []
    function Probe() {
      values.push(useMounted())
      return null
    }
    render(<Probe />)
    expect(values[0]).toBe(false)
    expect(values.at(-1)).toBe(true)
  })
})

describe('hooks used outside their provider throw', () => {
  it.each([
    ['useLocale', useLocale],
    ['useSearchBarRef', useSearchBarRef],
    ['useCart', useCart],
    ['useCatalog', useCatalog],
    ['useDemo', useDemo],
    ['useEventLog', useEventLog],
  ])('%s', (name, hook) => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => hook())).toThrow(/must be used inside/)
  })
})
