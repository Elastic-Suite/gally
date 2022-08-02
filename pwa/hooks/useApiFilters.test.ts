import { act } from '@testing-library/react-hooks'

import { resourceWithRef } from '~/mocks'
import sourceFields from '~/public/mocks/source_fields.json'
import { renderHookWithProviders } from '~/utils/tests'

import { useApiFilters } from './useApiFilters'

jest.mock('react-i18next')
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
        type: 0,
      },
      {
        id: 'isFilterable',
        label: 'Filterable',
        multiple: false,
        options: [],
        type: 0,
      },
      {
        id: 'code',
        label: 'Attribute code',
        multiple: false,
        options: [],
        type: 1,
      },
      {
        id: 'defaultLabel',
        label: 'Attribute label',
        multiple: false,
        options: [],
        type: 1,
      },
      {
        id: 'type',
        label: 'Attribute type',
        multiple: false,
        options: [],
        type: 1,
      },
      {
        id: 'metadata[]',
        label: 'metadata',
        multiple: true,
        options: [],
        type: 2,
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
