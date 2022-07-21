import { renderHookWithProviders } from '~/services'
import { LoadStatus } from '~/types'
import { useApiDispatch, useApiFetch } from './useApi'

jest.mock('react-i18next')
jest.mock('~/services/api')

describe('useApi', () => {
  describe('useApiFetch', () => {
    it('calls and return the api result', async () => {
      const { result, waitForNextUpdate } = renderHookWithProviders(() =>
        useApiFetch('/test')
      )
      expect(result.current[0]).toEqual({
        status: LoadStatus.LOADING,
      })
      await waitForNextUpdate()
      expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world' },
      })
    })
  })

  describe('useApiDispatch', () => {
    it('calls and return the api result', () => {
      const action = jest.fn()
      // @ts-expect-error use spy
      renderHookWithProviders(() => useApiDispatch(action, '/test'))
      expect(action).toHaveBeenCalledWith({ status: LoadStatus.LOADING })
    })
  })
})
