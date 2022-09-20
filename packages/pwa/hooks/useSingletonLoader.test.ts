import { act } from '@testing-library/react'

import { renderHookWithProviders } from '~/utils/tests'

import { ILoader, useSingletonLoader } from './useSingletonLoader'

jest.mock('shared')

describe('useSingletonLoader', () => {
  it('should update the state', () => {
    const { result } = renderHookWithProviders(() => useSingletonLoader())
    expect(result.current.map).toEqual(new Map())
    act(() => result.current.setMap(new Map([['batman', 'robin']])))
    expect(result.current.map).toEqual(new Map([['batman', 'robin']]))
  })

  it('should call the loader function', async () => {
    const spy = jest.fn(() => 'robin')
    const { result } = renderHookWithProviders(() => useSingletonLoader())
    expect(result.current.map).toEqual(new Map())
    await act(() =>
      result.current.fetch('batman', spy as unknown as ILoader<unknown>)
    )
    expect(result.current.map).toEqual(new Map([['batman', 'robin']]))
    expect(spy).toHaveBeenCalled()
  })

  it('should not call the loader function twice', async () => {
    const spy = jest.fn(() => 'robin')
    const { result } = renderHookWithProviders(() => useSingletonLoader())
    expect(result.current.map).toEqual(new Map())
    await act(() =>
      Promise.all([
        result.current.fetch('batman', spy as unknown as ILoader<unknown>),
        result.current.fetch('batman', spy as unknown as ILoader<unknown>),
      ]).then(() => undefined)
    )
    expect(result.current.map).toEqual(new Map([['batman', 'robin']]))
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
