import { resourceWithRef } from '~/mocks'
import { renderHookWithProviders } from '~/utils/tests'

import { useApiHeaders } from './useApiHeaders'

describe('useApiHeaders', () => {
  it('should return the headers from a resource', () => {
    const { result } = renderHookWithProviders(() =>
      useApiHeaders(resourceWithRef)
    )
    expect(result.current).toEqual([
      {
        field: 'code',
        headerName: 'Attribute code',
        type: 'string',
        editable: true,
      },
      {
        field: 'defaultLabel',
        headerName: 'Attribute label',
        type: 'string',
        editable: true,
      },
      {
        field: 'type',
        headerName: 'Attribute type',
        type: 'string',
        editable: true,
      },
      {
        editable: true,
        field: 'isFilterable',
        headerName: 'Filterable',
        type: 'boolean',
      },
      {
        editable: true,
        field: 'isSearchable',
        headerName: 'Searchable',
        type: 'boolean',
      },
      {
        editable: true,
        field: 'isSortable',
        headerName: 'Sortable',
        type: 'boolean',
      },
    ])
  })
})
