import { waitFor } from '@testing-library/react'

import { renderHookWithProviders } from '../utils/tests'

import { useDocumentSort } from './useDocumentSort'
import { cmsPageEntityType } from '@elastic-suite/gally-admin-shared'

jest.mock('./useGraphql', () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  useGraphqlApi: () => [
    {
      data: {
        sortingOptions: [
          { label: 'Title', code: 'title' },
          { label: 'Relevance', code: '_score' },
        ],
      },
    },
    jest.fn(),
    jest.fn(),
  ],
}))

describe('useDocumentSort', () => {
  it('should load the sortOptions', async () => {
    const { result } = renderHookWithProviders(() =>
      useDocumentSort(cmsPageEntityType)
    )
    await waitFor(() =>
      expect(result.current[2]).toEqual([
        { label: 'Title', value: 'title' },
        { label: 'Relevance', value: '_score' },
      ])
    )
  })
})
