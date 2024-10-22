import { act, waitFor } from '@testing-library/react'
import {
  LoadStatus,
  ProductRequestType,
  fetchGraphql,
} from '@elastic-suite/gally-admin-shared'

import { useProducts } from './useProducts'
import { renderHookWithProviders } from '../utils/tests'

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
