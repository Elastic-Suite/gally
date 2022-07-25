import { api, fieldBoolean, fieldInteger, fieldString } from '~/mocks'
import metadata from '~/public/mocks/metadata.json'

import { getFieldType, getOptionsFromApi, getResource } from './hydra'

describe('Hydra service', () => {
  describe('firstLetterUppercase', () => {
    it('Should return the resource', () => {
      expect(getResource(api, 'source_fields')).toMatchObject({
        name: 'source_fields',
      })
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
})
