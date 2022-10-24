import { resourceWithRef } from 'shared'
import sourceFields from '~/public/mocks/source_fields.json'
import { renderHookWithProviders } from '~/utils/tests'

import { useApiFilters } from './useApiFilters'

describe('useApiFilters', () => {
  it('should return the filters from a resource', () => {
    const { result } = renderHookWithProviders(() =>
      useApiFilters(sourceFields, resourceWithRef)
    )
    expect(result.current).toEqual([
      expect.objectContaining({
        id: 'code',
        label: 'Attribute code',
        multiple: false,
        type: 'string',
      }),
      expect.objectContaining({
        id: 'defaultLabel',
        label: 'Attribute label',
        multiple: false,
        type: 'string',
      }),
      expect.objectContaining({
        id: 'type',
        label: 'Attribute type',
        multiple: false,
        type: 'string',
      }),
      expect.objectContaining({
        id: 'isFilterable',
        label: 'Filterable',
        multiple: false,
        type: 'boolean',
      }),
      expect.objectContaining({
        id: 'isSearchable',
        label: 'Searchable',
        multiple: false,
        type: 'boolean',
      }),
    ])
  })
})
