import { waitFor } from '@testing-library/react'
import { LoadStatus, api } from 'shared'

import { renderHookWithProviders } from '../utils/tests'

import { useSchemaLoader } from './useSchemaLoader'

jest.mock('../services/parser')

describe('useSchemaLoader', () => {
  it('should loads the doc api', async () => {
    const { result } = renderHookWithProviders(() => useSchemaLoader())
    expect(result.current).toEqual({ status: LoadStatus.LOADING })
    await waitFor(() =>
      expect(result.current).toEqual({
        data: api,
        status: LoadStatus.SUCCEEDED,
      })
    )
  })
})
