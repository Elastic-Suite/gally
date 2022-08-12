import { resource, resourceWithRef } from '~/mocks'
import { fetchApi } from '~/services/api'
import { IHydraMember } from '~/types'
import { renderHookWithProviders } from '~/utils/tests'

import { useResource, useResourceOperations } from './useResource'

jest.mock('~/services/api')

interface ITest extends IHydraMember {
  hello: string
}

describe('useResource', () => {
  describe('useResource', () => {
    it('should return the resource', () => {
      const { result } = renderHookWithProviders(() =>
        useResource('SourceField')
      )
      expect(result.current).toEqual(resourceWithRef)
    })
  })

  describe('useResourceOperations', () => {
    it('should return the resource operations', () => {
      const { result } = renderHookWithProviders(() =>
        useResourceOperations(resource)
      )
      expect(result.current).toMatchObject({
        create: expect.any(Function),
        replace: expect.any(Function),
        update: expect.any(Function),
        delete: expect.any(Function),
      })
    })

    it('should call the API (create)', () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() =>
        useResourceOperations<ITest>(resource)
      )
      result.current.create({ hello: 'world' })
      expect(fetchApi).toHaveBeenCalled()
    })

    it('should call the API (replace)', () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() =>
        useResourceOperations<ITest>(resource)
      )
      result.current.replace({ id: 1, hello: 'world' })
      expect(fetchApi).toHaveBeenCalled()
    })

    it('should call the API (update)', () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() =>
        useResourceOperations<ITest>(resource)
      )
      result.current.update(1, { hello: 'world' })
      expect(fetchApi).toHaveBeenCalled()
    })

    it('should call the API (delete))', () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() =>
        useResourceOperations<ITest>(resource)
      )
      result.current.delete(1)
      expect(fetchApi).toHaveBeenCalled()
    })
  })
})
