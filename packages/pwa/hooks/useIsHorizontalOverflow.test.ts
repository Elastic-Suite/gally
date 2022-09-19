import { act } from '@testing-library/react'

import { renderHookWithProviders } from '~/utils/tests'

import { useIsHorizontalOverflow } from './useIsHorizontalOverflow'

describe('useIsHorizontalOverflow', () => {
  it('should properly detect if no overflow', () => {
    const current = {
      scrollWidth: 10,
      clientWidth: 20,
    }
    const { result } = renderHookWithProviders(() =>
      useIsHorizontalOverflow(current as HTMLDivElement)
    )
    expect(result.current.isOverflow).toEqual(false)
    expect(result.current.shadow).toEqual(false)
  })

  it('should properly detect if overflow', () => {
    const current = {
      scrollWidth: 20,
      clientWidth: 10,
      addEventListener: jest.fn(),
    } as unknown as HTMLDivElement
    const { result } = renderHookWithProviders(() =>
      useIsHorizontalOverflow(current)
    )
    expect(result.current.isOverflow).toEqual(true)
    expect(current.addEventListener).toHaveBeenCalled()
  })

  it('should properly set shadow', () => {
    let callBack: (e: UIEvent) => void
    const spy = jest.fn((_, fn) => {
      callBack = fn
    })
    const current = {
      scrollWidth: 20,
      clientWidth: 10,
      addEventListener: spy,
    } as unknown as HTMLDivElement
    const { result } = renderHookWithProviders(() =>
      useIsHorizontalOverflow(current)
    )
    act(() => callBack({ target: { scrollLeft: 1 } } as unknown as UIEvent))
    expect(result.current.shadow).toEqual(true)
  })
})
