import { act, waitFor } from '@testing-library/react'
import {
  LoadStatus,
  cmsPageEntityType,
  fetchGraphql,
} from '@elastic-suite/gally-admin-shared'

import { renderHookWithProviders } from '../utils/tests'

import { useDocuments } from './useDocuments'

describe('useDocuments', () => {
  it('should call the API when loading the documents', async () => {
    const { result } = renderHookWithProviders(() =>
      useDocuments(cmsPageEntityType)
    )
    expect(result.current.documents).toEqual({
      status: LoadStatus.IDLE,
    })
    await act(() => result.current.loadDocuments(true))
    await waitFor(() => expect(fetchGraphql).toHaveBeenCalled())
    expect(fetchGraphql).toHaveBeenCalled()
  })
})
