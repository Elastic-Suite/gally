import { resourceWithRef } from '~/mocks'
import { renderHookWithProviders } from '~/services'

import { useApiHeaders } from './useApiHeaders'

jest.mock('react-i18next')

describe('useApiHeaders', () => {
  it('should return the headers from a resource', () => {
    const { result } = renderHookWithProviders(() =>
      useApiHeaders(resourceWithRef)
    )
    expect(result.current).toEqual([
      {
        field: 'code',
        headerName: 'fields.code',
        type: 'string',
        editable: false,
      },
      {
        field: 'weight',
        headerName: 'fields.weight',
        type: 'string',
        editable: false,
      },
      {
        field: 'searchable',
        headerName: 'fields.searchable',
        type: 'boolean',
        editable: false,
      },
    ])
  })
})
