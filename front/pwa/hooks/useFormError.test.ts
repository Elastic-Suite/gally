import { act, waitFor } from '@testing-library/react'
import { SyntheticEvent } from 'react'

import { renderHookWithProviders } from '~/utils/tests'

import { useFormError } from './useFormError'

describe('useFormError', () => {
  it('should validate without errors', () => {
    const onChangeSpy = jest.fn()
    const { result } = renderHookWithProviders(() => useFormError(onChangeSpy))
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)
    const event = {
      target: { validity: { valid: true } },
    } as unknown as SyntheticEvent
    result.current[0].onChange(42, event)
    expect(onChangeSpy).toHaveBeenCalledWith(42, event)
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)
  })

  it('should validate with error but not trigger onChange', () => {
    const onChangeSpy = jest.fn()
    const { result } = renderHookWithProviders(() => useFormError(onChangeSpy))
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)
    const event = {
      target: { validity: { valid: false, test: true } },
    } as unknown as SyntheticEvent
    result.current[0].onChange(42, event)
    expect(onChangeSpy).not.toHaveBeenCalled()
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)
  })

  it('should validate with error and trigger onChange', async () => {
    const onChangeSpy = jest.fn()
    const { result } = renderHookWithProviders(() =>
      useFormError(onChangeSpy, true)
    )
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)
    const event = {
      target: { validity: { valid: false, test: true } },
    } as unknown as SyntheticEvent
    act(() => result.current[0].onChange(42, event))
    expect(onChangeSpy).toHaveBeenCalledWith(42, event)
    await waitFor(() => expect(result.current[0].error).toEqual(true))
    expect(result.current[0].helperIcon).toEqual('close')
    expect(result.current[0].helperText).toEqual('formError.test')
  })
})
