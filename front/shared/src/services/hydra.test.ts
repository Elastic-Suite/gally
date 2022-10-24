import categorySortingOptions from '../mocks/static/category_sorting_options.json'
import metadata from '../mocks/static/metadata.json'
import sourceFieldOptionLabels from '../mocks/static/source_field_option_labels.json'

import {
  api,
  fieldBoolean,
  fieldInteger,
  fieldRef,
  fieldString,
  resource,
  resourceWithRef,
} from '../mocks'

import {
  castFieldParameter,
  getField,
  getFieldName,
  getFieldType,
  getFilterParameters,
  getOptionsFromApiSchema,
  getOptionsFromLabelResource,
  getOptionsFromResource,
  getReferencedResource,
  getResource,
  isFieldValueValid,
  isReferenceField,
} from './hydra'

describe('Hydra service', () => {
  describe('getResource', () => {
    it('Should return the resource', () => {
      expect(getResource(api, 'SourceField')).toEqual(resourceWithRef)
    })
  })

  describe('getFieldName', () => {
    it('should return the field name', () => {
      expect(getFieldName('code')).toEqual('code')
      expect(getFieldName('metadata[]')).toEqual('metadata')
    })
  })

  describe('getField', () => {
    it('Should return the field', () => {
      expect(getField(resourceWithRef, 'code')).toMatchObject(fieldString)
      expect(getField(resourceWithRef, 'isFilterable')).toMatchObject(
        fieldBoolean
      )
      expect(getField(resourceWithRef, 'weight')).toMatchObject(fieldInteger)
      expect(getField(resourceWithRef, 'metadata')).toMatchObject(fieldRef)
      expect(getField(resourceWithRef, 'foo')).toEqual(undefined)
    })
  })

  describe('getFieldType', () => {
    it('Should return the field type', () => {
      expect(getFieldType(fieldString)).toEqual('text')
      expect(getFieldType(fieldInteger)).toEqual('integer')
      expect(getFieldType(fieldBoolean)).toEqual('boolean')
      expect(
        getFieldType({
          ...fieldString,
          property: {
            ...fieldString.property,
            range: {
              '@id': 'http://www.w3.org/2001/XMLSchema#integer',
            },
          },
        })
      ).toEqual('integer')
    })
  })

  describe('isReferenceField', () => {
    it('Should check if given field is a reference', () => {
      expect(isReferenceField(fieldString)).toEqual(false)
      expect(isReferenceField(fieldRef)).toEqual(true)
    })
  })

  describe('getReferencedResource', () => {
    it('Should return the reference resource', () => {
      expect(getReferencedResource(api, fieldRef)).toEqual(resource)
    })
  })

  describe('getOptionsFromResource', () => {
    it('Should return the options', () => {
      expect(getOptionsFromResource(metadata)).toEqual([
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

  describe('getOptionsFromLabelResource', () => {
    it('Should return the options', () => {
      expect(
        getOptionsFromLabelResource(sourceFieldOptionLabels as any)
      ).toEqual([
        {
          id: 1,
          label: 'Marque 1',
          value: 1,
        },
        {
          id: 2,
          label: 'Marque 2',
          value: 2,
        },
        {
          id: 3,
          label: 'Brand 1',
          value: 3,
        },
        {
          id: 4,
          label: 'Brand 2',
          value: 4,
        },
      ])
    })
  })

  describe('getOptionsFromApiSchema', () => {
    it('Should return the options', () => {
      expect(getOptionsFromApiSchema(categorySortingOptions)).toEqual([
        {
          id: 'position',
          label: 'Position',
          value: 'position',
        },
        {
          id: 'id',
          label: 'Id',
          value: 'id',
        },
        {
          id: 'stock.status',
          label: 'Stock status',
          value: 'stock.status',
        },
        {
          id: 'sku',
          label: 'Sku',
          value: 'sku',
        },
        {
          id: 'price',
          label: 'Price',
          value: 'price',
        },
      ])
    })
  })

  describe('castFieldParameter', () => {
    it('Should cast the field value', () => {
      expect(castFieldParameter(fieldString, 'foo')).toEqual('foo')

      expect(castFieldParameter(fieldBoolean, 'true')).toEqual(true)
      expect(castFieldParameter(fieldBoolean, 'false')).toEqual(false)
      expect(castFieldParameter(fieldBoolean, 'foo')).toEqual(null)

      expect(castFieldParameter(fieldInteger, '42')).toEqual(42)

      expect(castFieldParameter(fieldRef, '42')).toEqual(42)
      expect(castFieldParameter(fieldRef, ['1', '2', '3'])).toEqual([1, 2, 3])
    })
  })

  describe('isFieldValueValid', () => {
    it('Should validate the field value', () => {
      expect(isFieldValueValid(fieldString, 'foo')).toEqual(true)

      expect(isFieldValueValid(fieldBoolean, true)).toEqual(true)
      expect(isFieldValueValid(fieldBoolean, false)).toEqual(true)
      expect(isFieldValueValid(fieldBoolean, null)).toEqual(false)

      expect(isFieldValueValid(fieldInteger, 42)).toEqual(true)
      expect(isFieldValueValid(fieldInteger, NaN)).toEqual(false)

      expect(isFieldValueValid(fieldRef, 42)).toEqual(true)
      expect(isFieldValueValid(fieldRef, [1, 2, 3])).toEqual(true)
    })
  })

  describe('getFilterParameters', () => {
    it('Should get only filter parameters', () => {
      expect(
        getFilterParameters(resourceWithRef, {
          code: 'foo',
          'metadata[]': ['1'],
          foo: 'bar', // Does not exist on resourceWithRef
          weight: 'baz', // Wrong type
        })
      ).toEqual({
        code: 'foo',
        'metadata[]': [1],
      })
    })
  })
})
