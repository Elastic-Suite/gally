import { act } from '@testing-library/react-hooks'

import { fieldDropdown, fieldDropdownWithApiOptions, fieldRef } from '~/mocks'
import { fetchApi } from '~/services/api'
import { renderHookWithProviders } from '~/utils/tests'

import { useOptions } from './useOptions'

jest.mock('~/services/api')

describe('useOptions', () => {
  it('should load the field schema static options', async () => {
    const { result } = renderHookWithProviders(() => useOptions())
    expect(result.current.fieldOptions).toEqual(new Map())
    await act(() => result.current.load(fieldDropdown))
    expect(
      result.current.fieldOptions.get(fieldDropdown.property['@id'])
    ).toEqual([
      { value: 'option_test1', label: 'option_test1' },
      { value: 'option_test2', label: 'option_test2' },
    ])
  })

  it('should load the field schema api options', async () => {
    const { result } = renderHookWithProviders(() => useOptions())
    expect(result.current.fieldOptions).toEqual(new Map())
    await act(() => result.current.load(fieldDropdownWithApiOptions))
    expect(
      result.current.fieldOptions.get(
        fieldDropdownWithApiOptions.property['@id']
      )
    ).toEqual([
      { id: 'position', value: 'position', label: 'Position' },
      { id: 'id', value: 'id', label: 'Id' },
      { id: 'stock.status', value: 'stock.status', label: 'Stock status' },
      { id: 'sku', value: 'sku', label: 'Sku' },
      { id: 'price', value: 'price', label: 'Price' },
    ])
  })

  it('should load the field resource options', async () => {
    ;(fetchApi as jest.Mock).mockClear()
    const { result } = renderHookWithProviders(() => useOptions())
    expect(result.current.fieldOptions).toEqual(new Map())
    await act(() => result.current.load(fieldRef))
    expect(result.current.fieldOptions.get(fieldRef.property['@id'])).toEqual([
      { id: 1, value: 1, label: '/metadata/1' },
      { id: 2, value: 2, label: '/metadata/2' },
    ])
    expect(fetchApi).toHaveBeenCalledTimes(1)
  })

  it('should not load the options twice', async () => {
    ;(fetchApi as jest.Mock).mockClear()
    const { result } = renderHookWithProviders(() => useOptions())
    expect(result.current.fieldOptions).toEqual(new Map())
    await act(() =>
      Promise.all([
        result.current.load(fieldRef),
        result.current.load(fieldRef),
      ])
    )
    expect(result.current.fieldOptions.get(fieldRef.property['@id'])).toEqual([
      { id: 1, value: 1, label: '/metadata/1' },
      { id: 2, value: 2, label: '/metadata/2' },
    ])
    expect(fetchApi).toHaveBeenCalledTimes(1)
  })
})
