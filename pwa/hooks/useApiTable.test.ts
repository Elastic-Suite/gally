import { resourceWithRef } from '~/mocks'
import { renderHookWithProviders } from '~/utils/tests'

import { useApiEditableFieldOptions, useApiHeaders } from './useApiTable'

describe('useApiTable', () => {
  describe('useApiHeaders', () => {
    it('should return the headers from a resource', () => {
      const { result } = renderHookWithProviders(() =>
        useApiHeaders(resourceWithRef)
      )
      expect(result.current).toEqual([
        {
          name: 'code',
          label: 'Attribute code',
          type: 'string',
          editable: false,
          options: null,
          required: false,
        },
        {
          name: 'defaultLabel',
          label: 'Attribute label',
          type: 'string',
          editable: false,
          options: null,
          required: false,
        },
        {
          name: 'type',
          label: 'Attribute type',
          type: 'string',
          editable: false,
          options: null,
          required: false,
        },
        {
          name: 'isFilterable',
          label: 'Filterable',
          type: 'boolean',
          editable: true,
          options: null,
          required: false,
        },
        {
          name: 'isSearchable',
          label: 'Searchable',
          type: 'boolean',
          editable: true,
          options: null,
          required: false,
        },
        {
          name: 'isSortable',
          label: 'Sortable',
          type: 'boolean',
          editable: true,
          options: null,
          required: false,
        },
        {
          name: 'isUsedForRules',
          label: 'Use in rule engine',
          type: 'boolean',
          editable: true,
          options: null,
          required: false,
        },
      ])
    })
  })

  describe('useApiEditableFieldOptions', () => {
    it('should return the headers from a resource', () => {
      const { result } = renderHookWithProviders(() =>
        useApiEditableFieldOptions(resourceWithRef)
      )
      expect(result.current).toEqual([
        expect.objectContaining({
          id: 'isFilterable',
          label: 'Filterable',
        }),
        expect.objectContaining({
          id: 'isSearchable',
          label: 'Searchable',
        }),
        expect.objectContaining({
          id: 'isSortable',
          label: 'Sortable',
        }),
        expect.objectContaining({
          id: 'isUsedForRules',
          label: 'Use in rule engine',
        }),
      ])
    })
  })
})
