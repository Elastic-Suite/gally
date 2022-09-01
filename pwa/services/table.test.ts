import {
  fieldBoolean,
  fieldRef,
  fieldString,
  mockedFieldWithDropdown,
  resourceWithRef,
} from '~/mocks'
import { DataContentType } from '~/types'
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
        name: 'code',
        label: 'Attribute code',
        type: DataContentType.STRING,
        editable: false,
        options: null,
        required: true,
      })
    })
    it('should return the field header with options in case of dropdown type', () => {
      expect(
        getFieldHeader(mockedFieldWithDropdown, (key: string) => key)
      ).toEqual({
        name: 'code',
        label: 'Attribute code',
        type: DataContentType.DROPDOWN,
        editable: false,
        required: true,
        options: [
          {
            label: 'option_test1',
            value: 'option_test1',
          },
          {
            label: 'option_test2',
            value: 'option_test2',
          },
        ],
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
        label: 'Attribute code',
        multiple: false,
        options: undefined,
        type: DataContentType.STRING,
      })
    })
  })

  describe('getMappings', () => {
    it('should return the mappings object', () => {
      const pathTest = 'test/no/specific/context'
      const mappings = getMappings(sourceFields, resourceWithRef, pathTest)
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
