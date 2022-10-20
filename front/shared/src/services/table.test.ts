import {
  fieldBoolean,
  fieldDropdown,
  fieldRef,
  fieldString,
  resourceWithRef,
} from '../mocks'
import { DataContentType } from '../types'
import sourceFields from '../mocks/static/source_fields.json'

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
      expect(getFieldDataContentType(fieldDropdown)).toEqual(
        DataContentType.DROPDOWN
      )
      expect(getFieldDataContentType(fieldString)).toEqual(
        DataContentType.STRING
      )
      expect(getFieldDataContentType(fieldBoolean)).toEqual(
        DataContentType.BOOLEAN
      )
      expect(
        getFieldDataContentType({
          ...fieldString,
          property: {
            ...fieldString.property,
            range: {
              '@id': 'http://www.w3.org/2001/XMLSchema#integer',
            },
          },
        })
      ).toEqual(DataContentType.NUMBER)
      expect(
        getFieldDataContentType({
          ...fieldString,
          elasticsuite: {
            type: 'percentage',
          },
        })
      ).toEqual(DataContentType.PERCENTAGE)
    })
  })

  describe('getFieldHeader', () => {
    it('should return the field header', () => {
      expect(getFieldHeader(fieldString, (key: string) => key)).toEqual({
        field: fieldString,
        name: 'code',
        label: 'Attribute code',
        type: DataContentType.STRING,
        editable: false,
        required: true,
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
      ).toEqual(DataContentType.STRING)
      expect(
        getFilterType({
          '@type': 'IriTemplateMapping',
          variable: 'isSearchable',
          property: 'isSearchable',
          required: false,
          field: fieldBoolean,
          multiple: false,
        })
      ).toEqual(DataContentType.BOOLEAN)
      expect(
        getFilterType({
          '@type': 'IriTemplateMapping',
          variable: 'metadata[]',
          property: 'metadata',
          required: false,
          field: fieldRef,
          multiple: true,
        })
      ).toEqual(DataContentType.DROPDOWN)
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
        field: fieldString,
        label: 'Attribute code',
        multiple: false,
        options: undefined,
        type: DataContentType.STRING,
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
    })
  })
})
