import { act } from '@testing-library/react'

import { resourceWithRef } from '~/mocks'
import sourceFields from '~/public/mocks/source_fields.json'
import { renderHookWithProviders } from '~/services'

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
        label: 'fields.searchable',
        multiple: false,
        options: [],
        type: 0,
      },
      {
        id: 'isFilterable',
        label: 'fields.isFilterable',
        multiple: false,
        options: [],
        type: 0,
      },
      {
        id: 'code',
        label: 'fields.code',
        multiple: false,
        options: [],
        type: 1,
      },
      {
        id: 'defaultLabel',
        label: 'fields.defaultLabel',
        multiple: false,
        options: [],
        type: 1,
      },
      {
        id: 'type',
        label: 'fields.type',
        multiple: false,
        options: [],
        type: 1,
      },
      {
        id: 'metadata[]',
        label: 'fields.metadata',
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
