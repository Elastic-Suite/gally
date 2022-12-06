import categorySortingOptions from '../mocks/static/category_sorting_options.json'
import metadata from '../mocks/static/metadata.json'
import sourceFieldOptions from '../mocks/static/source_field_options.json'
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
  IHydraResponse,
  ISourceFieldOption,
  ISourceFieldOptionLabel,
} from '../types'

import {
  castFieldParameter,
  getField,
  getFieldName,
  getFieldType,
  getFilterParameters,
  getOptionsFromApiSchema,
  getOptionsFromLabelResource,
  getOptionsFromOptionLabelResource,
  getOptionsFromOptionResource,
  getOptionsFromResource,
  getReferencedResource,
  getResource,
  isFieldValueValid,
  isHydraError,
  isJSonldType,
  isReferenceField,
} from './hydra'

describe('Hydra service', () => {
  describe('isJSonldType', () => {
    it('should check if object is a JsonldBase', () => {
      expect(
        isJSonldType({
          '@context': 'test',
          '@type': 'test',
        })
      ).toEqual(true)
    })
  })

  describe('isHydraError', () => {
    it('should check if response is a hydra error', () => {
      expect(
        isHydraError({
          '@type': 'hydra:Error',
        })
      ).toEqual(true)
    })
  })

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
          id: 3000,
          label: 'Doré',
          value: 3000,
        },
        {
          id: 3001,
          label: 'Pêche',
          value: 3001,
        },
        {
          id: 3002,
          label: 'Kaki',
          value: 3002,
        },
        {
          id: 3003,
          label: 'Argent',
          value: 3003,
        },
        {
          id: 3004,
          label: 'Lila',
          value: 3004,
        },
        {
          id: 3005,
          label: 'Pluie',
          value: 3005,
        },
        {
          id: 3006,
          label: 'Menthe',
          value: 3006,
        },
        {
          id: 3007,
          label: 'Lily',
          value: 3007,
        },
        {
          id: 3008,
          label: 'Latte',
          value: 3008,
        },
        {
          id: 3009,
          label: 'Coco',
          value: 3009,
        },
        {
          id: 3010,
          label: 'Noir',
          value: 3010,
        },
        {
          id: 3011,
          label: 'Gris',
          value: 3011,
        },
        {
          id: 3012,
          label: 'Orange',
          value: 3012,
        },
      ])
    })
  })

  describe('getOptionsFromOptionResource', () => {
    it('should return the options using the default label', () => {
      expect(
        getOptionsFromOptionResource(
          sourceFieldOptions as unknown as IHydraResponse<ISourceFieldOption>
        )
      ).toEqual([
        {
          id: '5',
          label: 'Doré',
          value: '5',
        },
        {
          id: '22',
          label: 'Pêche',
          value: '22',
        },
        {
          id: '23',
          label: 'Kaki',
          value: '23',
        },
        {
          id: '6',
          label: 'Argent',
          value: '6',
        },
        {
          id: '24',
          label: 'Lila',
          value: '24',
        },
        {
          id: '25',
          label: 'Pluie',
          value: '25',
        },
        {
          id: '26',
          label: 'Menthe',
          value: '26',
        },
        {
          id: '27',
          label: 'Lily',
          value: '27',
        },
        {
          id: '28',
          label: 'Latte',
          value: '28',
        },
        {
          id: '29',
          label: 'Coco',
          value: '29',
        },
        {
          id: '30',
          label: 'Noir',
          value: '30',
        },
        {
          id: '31',
          label: 'Gris',
          value: '31',
        },
        {
          id: '32',
          label: 'Orange',
          value: '32',
        },
      ])
    })

    it('should return the options using the localized catalog label', () => {
      expect(
        getOptionsFromOptionResource(
          sourceFieldOptions as unknown as IHydraResponse<ISourceFieldOption>,
          50
        )
      ).toEqual([
        {
          id: '5',
          label: 'Gold',
          value: '5',
        },
        {
          id: '22',
          label: 'Peach',
          value: '22',
        },
        {
          id: '23',
          label: 'Khaki',
          value: '23',
        },
        {
          id: '6',
          label: 'Silver',
          value: '6',
        },
        {
          id: '24',
          label: 'Lilac',
          value: '24',
        },
        {
          id: '25',
          label: 'Rain',
          value: '25',
        },
        {
          id: '26',
          label: 'Mint',
          value: '26',
        },
        {
          id: '27',
          label: 'Lily',
          value: '27',
        },
        {
          id: '28',
          label: 'Latte',
          value: '28',
        },
        {
          id: '29',
          label: 'Cocoa',
          value: '29',
        },
        {
          id: '30',
          label: 'Black',
          value: '30',
        },
        {
          id: '31',
          label: 'Gray',
          value: '31',
        },
        {
          id: '32',
          label: 'Orange',
          value: '32',
        },
      ])
    })
  })

  describe('getOptionsFromOptionLabelResource', () => {
    it('Should return the options', () => {
      expect(
        getOptionsFromOptionLabelResource(
          sourceFieldOptionLabels as unknown as IHydraResponse<ISourceFieldOptionLabel>
        )
      ).toEqual([
        {
          id: '5',
          label: 'Doré',
          value: '5',
        },
        {
          id: '22',
          label: 'Pêche',
          value: '22',
        },
        {
          id: '23',
          label: 'Kaki',
          value: '23',
        },
        {
          id: '6',
          label: 'Argent',
          value: '6',
        },
        {
          id: '24',
          label: 'Lila',
          value: '24',
        },
        {
          id: '25',
          label: 'Pluie',
          value: '25',
        },
        {
          id: '26',
          label: 'Menthe',
          value: '26',
        },
        {
          id: '27',
          label: 'Lily',
          value: '27',
        },
        {
          id: '28',
          label: 'Latte',
          value: '28',
        },
        {
          id: '29',
          label: 'Coco',
          value: '29',
        },
        {
          id: '30',
          label: 'Noir',
          value: '30',
        },
        {
          id: '31',
          label: 'Gris',
          value: '31',
        },
        {
          id: '32',
          label: 'Orange',
          value: '32',
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
