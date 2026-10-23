// Navigation feedback: when the pending indicator appears and when it clears. Fake timers; the
// router and next/link's useLinkStatus are fakes. See specs/test-plan-shared-state.md, part C.
import { act, render } from '@testing-library/react'
import { useEffect } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  pathname: '/com_fr',
  push: vi.fn(),
  linkPending: false,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => fake.pathname,
  useRouter: () => ({ push: fake.push }),
}))
vi.mock('next/link', () => ({
  useLinkStatus: () => ({ pending: fake.linkPending }),
}))

import {
  LinkPendingReporter,
  NavigationProvider,
  useNavigate,
  useNavigationPending,
} from '../contexts/NavigationContext'

const seen: { pending: string | null; navigate?: (href: string) => void } = {
  pending: null,
}

// Copies what the hooks return out of the tree. In an effect, not during render: writing to an
// outside variable while rendering breaks the react-hooks rules. render() and act() flush it.
function Probe() {
  const pending = useNavigationPending()
  const navigate = useNavigate()
  useEffect(() => {
    seen.pending = pending
    seen.navigate = navigate
  })
  return null
}

const HREF = '/com_fr/category/cat_1'

function App({ showLink = true }: { showLink?: boolean }) {
  return (
    <NavigationProvider>
      <Probe />
      {showLink && <LinkPendingReporter href={HREF} />}
    </NavigationProvider>
  )
}

// Start a click on the link: useLinkStatus turns pending.
function clickLink() {
  fake.linkPending = true
  const view = render(<App />)
  return view
}

const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

beforeEach(() => {
  vi.useFakeTimers()
  fake.pathname = '/com_fr'
  fake.linkPending = false
  fake.push.mockReset()
})
afterEach(() => {
  vi.useRealTimers()
})

describe('pending indicator (bugfix-ssr-product-list-behind-suspense)', () => {
  it('appears only after 150 ms', () => {
    clickLink()
    wait(149)
    expect(seen.pending).toBeNull()
    wait(1)
    expect(seen.pending).toBe(HREF)
  })

  it('clears when the new page commits (the pathname changes)', () => {
    const view = clickLink()
    wait(150)
    fake.pathname = '/com_fr/category/cat_1'
    view.rerender(<App />)
    expect(seen.pending).toBeNull()
  })

  it('clears when the link reports it settled', () => {
    const view = clickLink()
    wait(150)
    fake.linkPending = false
    view.rerender(<App />)
    expect(seen.pending).toBeNull()
  })

  it('does not clear when the link unmounts', () => {
    // Most links sit inside the page the placeholder replaces; clearing on unmount put the old
    // page back on screen (MUST NOT in the spec).
    const view = clickLink()
    wait(150)
    view.rerender(<App showLink={false} />)
    expect(seen.pending).toBe(HREF)
  })

  it('gives up after 10 s', () => {
    clickLink()
    wait(9_999)
    expect(seen.pending).toBe(HREF)
    wait(1)
    expect(seen.pending).toBeNull()
  })

  it('stays pending when only the query changes (today: the pathname never differs)', () => {
    const view = clickLink()
    wait(150)
    view.rerender(<App />)
    expect(seen.pending).toBe(HREF)
  })
})

describe('useNavigate', () => {
  it('pushes the href it is given, as is', () => {
    render(<App showLink={false} />)
    act(() => seen.navigate!('/com_fr/search?q=robe'))
    expect(fake.push).toHaveBeenCalledWith('/com_fr/search?q=robe')
  })
})
