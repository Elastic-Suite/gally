import { act } from '@testing-library/react-hooks'

import { resourceWithRef } from '~/mocks'
import sourceFields from '~/public/mocks/source_fields.json'
import { renderHookWithProviders } from '~/utils/tests'

import { useApiFilters } from './useApiFilters'

jest.mock('~/services/api')

describe('useApiFilters', () => {
  it('should return the filters from a resource', async () => {
    const { result, waitForNextUpdate } = renderHookWithProviders(() =>
      useApiFilters(sourceFields, resourceWithRef)
    )
    expect(result.current).toEqual([
      {
        id: 'isSearchable',
        label: 'Searchable',
        multiple: false,
        options: [],
        type: 'boolean',
      },
      {
        id: 'isFilterable',
        label: 'Filterable',
        multiple: false,
        options: [],
        type: 'boolean',
      },
      {
        id: 'code',
        label: 'Attribute code',
        multiple: false,
        options: [],
        type: 'string',
      },
      {
        id: 'defaultLabel',
        label: 'Attribute label',
        multiple: false,
        options: [],
        type: 'string',
      },
      {
        id: 'type',
        label: 'Attribute type',
        multiple: false,
        options: [],
        type: 'string',
      },
      {
        id: 'metadata[]',
        label: 'metadata',
        multiple: true,
        options: [],
        type: 'dropdown',
      },
    ])
    await act(() => waitForNextUpdate())
    expect(result.current[5].options).toEqual([
      {
        id: 1,
        label: '/metadata/1',
        value: 1,
      },
      {
        id: 2,
        label: '/metadata/2',
        value: 2,
      },
    ])
  })
})
