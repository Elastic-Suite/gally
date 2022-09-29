import { resourceWithRef } from 'shared'
import { renderHookWithProviders } from '~/utils/tests'

import { useApiEditableFieldOptions, useApiHeaders } from './useApiTable'


describe('useApiTable', () => {
  describe('useApiHeaders', () => {
    it('should return the headers from a resource', () => {
      const { result } = renderHookWithProviders(() =>
        useApiHeaders(resourceWithRef)
      )
      expect(result.current).toEqual([
        expect.objectContaining({
          name: 'code',
          label: 'Attribute code',
          type: 'string',
          editable: false,
          required: true,
        }),
        expect.objectContaining({
          name: 'defaultLabel',
          label: 'Attribute label',
          type: 'string',
          editable: false,
          required: false,
        }),
        expect.objectContaining({
          name: 'type',
          label: 'Attribute type',
          type: 'string',
          editable: false,
          required: false,
        }),
        expect.objectContaining({
          name: 'isFilterable',
          label: 'Filterable',
          type: 'boolean',
          editable: true,
          required: false,
        }),
        expect.objectContaining({
          name: 'isSearchable',
          label: 'Searchable',
          type: 'boolean',
          editable: true,
          required: false,
        }),
        expect.objectContaining({
          name: 'isSortable',
          label: 'Sortable',
          type: 'boolean',
          editable: true,
          required: false,
        }),
        expect.objectContaining({
          name: 'isUsedForRules',
          label: 'Use in rule engine',
          type: 'boolean',
          editable: true,
          required: false,
        }),
        expect.objectContaining({
          name: 'isSystem',
          label: 'isSystem',
          type: 'boolean',
          editable: true,
          required: false,
        }),
        expect.objectContaining({
          name: 'metadata',
          label: 'metadata',
          type: 'string',
          editable: true,
          required: true,
        }),
        expect.objectContaining({
          name: 'labels',
          label: 'labels',
          type: 'string',
          editable: true,
          required: false,
        }),
        expect.objectContaining({
          name: 'options',
          label: 'options',
          type: 'string',
          editable: true,
          required: false,
        }),
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
        expect.objectContaining({
          id: 'isSystem',
          label: 'isSystem',
        }),
        expect.objectContaining({
          id: 'metadata',
          label: 'metadata',
        }),
        expect.objectContaining({
          id: 'labels',
          label: 'labels',
        }),
        expect.objectContaining({
          id: 'options',
          label: 'options',
        }),
      ])
    })
  })
})
