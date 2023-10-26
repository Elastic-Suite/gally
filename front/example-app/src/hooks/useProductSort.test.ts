import { waitFor } from '@testing-library/react'

import { renderHookWithProviders } from '../utils/tests'

import { useProductSort } from './useProductSort'

jest.mock('./useGraphql', () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  useGraphqlApi: () => [
    {
      data: {
        productSortingOptions: [
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
  ],
}))

describe('useProductSort', () => {
  it('should load the sortOptions', async () => {
    const { result } = renderHookWithProviders(() => useProductSort())
    await waitFor(() =>
      expect(result.current[2]).toEqual([
        { label: 'Position', value: 'category__position' },
        { label: 'Name', value: 'name' },
        { label: 'Final price', value: 'price__price' },
        { label: 'Stock status', value: 'stock__status' },
        { label: 'Relevance', value: '_score' },
      ])
    )
  })
})
