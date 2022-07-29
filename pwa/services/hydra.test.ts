import {
  api,
  fieldBoolean,
  fieldInteger,
  fieldRef,
  fieldString,
  resourceWithRef,
} from '~/mocks'
import metadata from '~/public/mocks/metadata.json'

import {
  castFieldParameter,
  getFieldType,
  getFilterParameters,
  getOptionsFromApi,
  getReadableField,
  getReadableFieldName,
  getResource,
  isFieldValueValid,
} from './hydra'

describe('Hydra service', () => {
  describe('getResource', () => {
    it('Should return the resource', () => {
      expect(getResource(api, 'source_fields')).toMatchObject({
        name: 'source_fields',
      })
    })
  })

  describe('getReadableFieldName', () => {
    it('should return the field name', () => {
      expect(getReadableFieldName('code')).toEqual('code')
      expect(getReadableFieldName('isSearchable')).toEqual('searchable')
      expect(getReadableFieldName('metadata[]')).toEqual('metadata')
    })
  })

  describe('getReadableField', () => {
    it('Should return the field', () => {
      expect(getReadableField(resourceWithRef, 'code')).toMatchObject(
        fieldString
      )
      expect(getReadableField(resourceWithRef, 'searchable')).toMatchObject(
        fieldBoolean
      )
      expect(getReadableField(resourceWithRef, 'weight')).toMatchObject(
        fieldInteger
      )
      expect(getReadableField(resourceWithRef, 'metadata')).toMatchObject(
        fieldRef
      )
    })
  })

  describe('getFieldType', () => {
    it('Should return the field type', () => {
      expect(getFieldType(fieldString)).toEqual('text')
      expect(getFieldType(fieldInteger)).toEqual('integer')
      expect(getFieldType(fieldBoolean)).toEqual('boolean')
    })
  })

  describe('getOptionsFromApi', () => {
    it('Should return the options', () => {
      expect(getOptionsFromApi(metadata)).toEqual([
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
