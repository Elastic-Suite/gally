import { resourceWithRef } from '~/mocks'
import { renderHookWithProviders } from '~/utils/tests'

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
        headerName: 'Attribute code',
        type: 'string',
        editable: false,
      },
      {
        field: 'defaultLabel',
        headerName: 'Attribute label',
        type: 'string',
        editable: false,
      },
      {
        field: 'type',
        headerName: 'Attribute type',
        type: 'string',
        editable: false,
      },
      {
        editable: false,
        field: 'isFilterable',
        headerName: 'Filterable',
        type: 'boolean',
      },
      {
        editable: false,
        field: 'isSearchable',
        headerName: 'Searchable',
        type: 'boolean',
      },
      {
        editable: false,
        field: 'isSortable',
        headerName: 'Sortable',
        type: 'boolean',
      },
    ])
  })
})
