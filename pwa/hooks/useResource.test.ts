import { resourceWithRef } from '~/mocks'
import { renderHookWithProviders } from '~/utils/tests'

import { useResource } from './useResource'

describe('useResource', () => {
  it('should return the resource', () => {
    const { result } = renderHookWithProviders(() => useResource('SourceField'))
    expect(result.current).toEqual(resourceWithRef)
  })
})
