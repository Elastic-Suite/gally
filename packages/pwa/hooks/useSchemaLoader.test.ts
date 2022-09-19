import { LoadStatus, api } from 'shared'
import { renderHookWithProviders } from '~/utils/tests'

import { useSchemaLoader } from './useSchemaLoader'

jest.mock('shared/api')
jest.mock('shared/parser')

describe('useSchemaLoader', () => {
  it('should loads the doc api', async () => {
    const { result, waitForNextUpdate } = renderHookWithProviders(() =>
      useSchemaLoader()
    )
    expect(result.current).toEqual({ status: LoadStatus.LOADING })
    await waitForNextUpdate()
    expect(result.current).toEqual({ data: api, status: LoadStatus.SUCCEEDED })
  })
})
