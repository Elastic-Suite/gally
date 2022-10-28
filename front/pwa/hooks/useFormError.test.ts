import { act, waitFor } from '@testing-library/react'
import { SyntheticEvent } from 'react'

import { renderHookWithProviders } from '~/utils/tests'

import { useFormError } from './useFormError'

describe('useFormError', () => {
  it('should validate without errors', () => {
    const onChangeSpy = jest.fn()
    const { result } = renderHookWithProviders(() => useFormError(onChangeSpy))
    expect(result.current.error).toEqual(false)
    expect(result.current.helperIcon).toEqual(undefined)
    expect(result.current.helperText).toEqual(undefined)
    const event = {
      target: { validity: { valid: true } },
    } as unknown as SyntheticEvent
    result.current.onChange(42, event)
    expect(onChangeSpy).toHaveBeenCalledWith(42, event)
    expect(result.current.error).toEqual(false)
    expect(result.current.helperIcon).toEqual(undefined)
    expect(result.current.helperText).toEqual(undefined)
  })

  it('should validate with error but not trigger onChange', () => {
    const onChangeSpy = jest.fn()
    const { result } = renderHookWithProviders(() => useFormError(onChangeSpy))
    expect(result.current.error).toEqual(false)
    expect(result.current.helperIcon).toEqual(undefined)
    expect(result.current.helperText).toEqual(undefined)
    const event = {
      target: { validity: { valid: false, test: true } },
    } as unknown as SyntheticEvent
    result.current.onChange(42, event)
    expect(onChangeSpy).not.toHaveBeenCalled()
    expect(result.current.error).toEqual(false)
    expect(result.current.helperIcon).toEqual(undefined)
    expect(result.current.helperText).toEqual(undefined)
  })

  it('should validate with error and trigger onChange', async () => {
    const onChangeSpy = jest.fn()
    const { result } = renderHookWithProviders(() =>
      useFormError(onChangeSpy, true)
    )
    expect(result.current.error).toEqual(false)
    expect(result.current.helperIcon).toEqual(undefined)
    expect(result.current.helperText).toEqual(undefined)
    const event = {
      target: { validity: { valid: false, test: true } },
    } as unknown as SyntheticEvent
    act(() => result.current.onChange(42, event))
    expect(onChangeSpy).toHaveBeenCalledWith(42, event)
    await waitFor(() => expect(result.current.error).toEqual(true))
    expect(result.current.helperIcon).toEqual('close')
    expect(result.current.helperText).toEqual('formError.test')
  })
})
