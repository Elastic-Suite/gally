import { act, waitFor } from '@testing-library/react'
import {
  LoadStatus,
  fetchGraphql,
  productEntityType,
} from '@elastic-suite/gally-admin-shared'

import { renderHookWithProviders } from '../utils/tests'

import { useVectorSearchDocuments } from './useVectorSearchDocuments'

describe('useVectorSearchDocuments', () => {
  it('should call the API when loading the vector search documents', async () => {
    const { result } = renderHookWithProviders(() =>
      useVectorSearchDocuments(productEntityType)
    )
    expect(result.current.vectorSearchDocuments).toEqual({
      status: LoadStatus.IDLE,
    })
    await act(() => result.current.loadVectorSearchDocuments(true))
    await waitFor(() => expect(fetchGraphql).toHaveBeenCalled())
    expect(fetchGraphql).toHaveBeenCalled()
  })
})
