import { api } from '~/mocks'
import { renderHookWithProviders } from '~/services'
import { LoadStatus } from '~/types'

import { useDocLoader } from './useDocLoader'

jest.mock('@api-platform/api-doc-parser')
jest.mock('~/services/api')

describe('useDocLoader', () => {
  it('should loads the doc api', async () => {
    const { result, waitForNextUpdate } = renderHookWithProviders(() =>
      useDocLoader()
    )
    expect(result.current).toEqual({ status: LoadStatus.LOADING })
    await waitForNextUpdate()
    expect(result.current).toEqual({ data: api, status: LoadStatus.SUCCEEDED })
  })
})
