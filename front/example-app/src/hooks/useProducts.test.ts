import { act, waitFor } from '@testing-library/react'
import {
  LoadStatus,
  ProductRequestType,
  fetchGraphql,
} from 'gally-admin-shared'

import { renderHookWithProviders } from '../utils/tests'

import { useProducts } from './useProducts'

describe('useProducts', () => {
  it('should call the API when loading the product', async () => {
    const { result } = renderHookWithProviders(() =>
      useProducts(ProductRequestType.SEARCH)
    )
    expect(result.current.products).toEqual({
      status: LoadStatus.IDLE,
    })
    await act(() => result.current.loadProducts(true))
    await waitFor(() => expect(fetchGraphql).toHaveBeenCalled())
    expect(fetchGraphql).toHaveBeenCalled()
  })
})
