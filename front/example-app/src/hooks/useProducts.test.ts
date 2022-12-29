import { act, waitFor } from '@testing-library/react'
import { LoadStatus, ProductRequestType } from 'gally-admin-shared'

import { renderHookWithProviders } from '../utils/tests'

import { useProducts } from './useProducts'

describe('useProducts', () => {
  it('should set the sort and sortOrder from the product response', async () => {
    const { result } = renderHookWithProviders(() =>
      useProducts(ProductRequestType.SEARCH)
    )
    expect(result.current.products).toEqual({
      status: LoadStatus.IDLE,
    })
    act(() => result.current.loadProducts(true))
    await waitFor(() =>
      expect(result.current.products).toEqual({
        data: {
          products: {
            collection: [],
            paginationInfo: { itemsPerPage: 10, lastPage: 9, totalCount: 85 },
            sortInfo: { current: [{ direction: 'desc', field: '_score' }] },
          },
        },
        status: LoadStatus.SUCCEEDED,
      })
    )
    expect(result.current.sort).toEqual('_score')
    expect(result.current.sortOrder).toEqual('desc')
  })
})
