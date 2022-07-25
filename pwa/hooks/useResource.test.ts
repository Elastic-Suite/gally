import { resourceWithRef } from '~/mocks'
import { renderHookWithProviders } from '~/services'

import { useResource } from './useResource'

describe('useResource', () => {
  it('should return the resource', () => {
    const { result } = renderHookWithProviders(() =>
      useResource('source_fields')
    )
    expect(result.current).toEqual(resourceWithRef)
  })
})
