import { waitFor } from '@testing-library/react'
import { ProductRequestType } from 'shared'

import { renderHookWithProviders } from '../utils/tests'

import { useProducts } from './useProducts'

jest.mock('./useGraphql', () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  useGraphqlApi: jest.fn((data: any) => {
    if (data.includes('getCategorySortingOptions')) {
      return [
        {
          data: {
            categorySortingOptions: [
              { label: 'Position', code: 'category__position' },
              { label: 'Name', code: 'name' },
              { label: 'Final price', code: 'price__price' },
              { label: 'Stock status', code: 'stock__status' },
              { label: 'Relevance', code: '_score' },
            ],
          },
        },
        jest.fn(),
        jest.fn(),
      ]
    }
    return [
      {
        data: {
          products: {
            collection: [],
            paginationInfo: { lastPage: 9, itemsPerPage: 10, totalCount: 85 },
            sortInfo: { current: [{ field: '_score', direction: 'desc' }] },
          },
        },
      },
      jest.fn(),
      jest.fn(),
    ]
  }),
}))

describe('useProducts', () => {
  it('should set the sort and sortOrder from the product response', async () => {
    const { result } = renderHookWithProviders(() =>
      useProducts(ProductRequestType.SEARCH)
    )
    await waitFor(() =>
      expect(result.current.products).toEqual({
        data: {
          products: {
            collection: [],
            paginationInfo: { itemsPerPage: 10, lastPage: 9, totalCount: 85 },
            sortInfo: { current: [{ direction: 'desc', field: '_score' }] },
          },
        },
      })
    )
    expect(result.current.sort).toEqual('_score')
    expect(result.current.sortOrder).toEqual('desc')
  })
})
