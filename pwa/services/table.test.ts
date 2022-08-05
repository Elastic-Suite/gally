import { fieldBoolean, fieldRef, fieldString, resourceWithRef } from '~/mocks'
import { DataContentType, FilterType } from '~/types'
import sourceFields from '~/public/mocks/source_fields.json'

import {
  getFieldDataContentType,
  getFieldHeader,
  getFilter,
  getFilterType,
  getMappings,
} from './table'

describe('Table service', () => {
  describe('getFieldDataContentType', () => {
    it('should return the DataContent type', () => {
      expect(getFieldDataContentType(fieldString)).toEqual(
        DataContentType.STRING
      )
      expect(getFieldDataContentType(fieldBoolean)).toEqual(
        DataContentType.BOOLEAN
      )
    })
  })

  describe('getFieldHeader', () => {
    it('should return the field header', () => {
      expect(getFieldHeader(fieldString, (key: string) => key)).toEqual({
        field: 'code',
        headerName: 'Attribute code',
        type: DataContentType.STRING,
        editable: false,
      })
    })
  })

  describe('getFilterType', () => {
    it('should return the filter type', () => {
      expect(
        getFilterType({
          '@type': 'IriTemplateMapping',
          variable: 'code',
          property: 'code',
          required: false,
          field: fieldString,
          multiple: false,
        })
      ).toEqual(FilterType.TEXT)
      expect(
        getFilterType({
          '@type': 'IriTemplateMapping',
          variable: 'isSearchable',
          property: 'isSearchable',
          required: false,
          field: fieldBoolean,
          multiple: false,
        })
      ).toEqual(FilterType.BOOLEAN)
      expect(
        getFilterType({
          '@type': 'IriTemplateMapping',
          variable: 'metadata[]',
          property: 'metadata',
          required: false,
          field: fieldRef,
          multiple: true,
        })
      ).toEqual(FilterType.SELECT)
    })
  })

  describe('getFilter', () => {
    it('should return the filter object', () => {
      expect(
        getFilter(
          {
            '@type': 'IriTemplateMapping',
            variable: 'code',
            property: 'code',
            required: false,
            field: fieldString,
            multiple: false,
          },
          (key: string) => key
        )
      ).toEqual({
        id: 'code',
        label: 'Attribute code',
        multiple: false,
        options: undefined,
        type: FilterType.TEXT,
      })
    })
  })

  describe('getMappings', () => {
    it('should return the mappings object', () => {
      const mappings = getMappings(sourceFields, resourceWithRef)
      expect(mappings[1]).toEqual({
        '@type': 'IriTemplateMapping',
        variable: 'isFilterable',
        property: 'isFilterable',
        required: false,
        field: fieldBoolean,
        multiple: false,
      })
      expect(mappings[2]).toEqual({
        '@type': 'IriTemplateMapping',
        variable: 'code',
        property: 'code',
        required: false,
        field: fieldString,
        multiple: false,
      })
      expect(mappings[5]).toEqual({
        '@type': 'IriTemplateMapping',
        variable: 'metadata[]',
        property: 'metadata',
        required: false,
        field: fieldRef,
        multiple: true,
      })
    })
  })
})
