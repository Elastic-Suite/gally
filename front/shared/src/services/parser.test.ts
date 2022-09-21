import { expandedDocs, expandedProperty, expandedRange } from '../mocks'
import {
  fetchDocs,
  findRelatedClass,
  getDocumentationUrlFromHeaders,
  getSupportedClassMap,
  isIJsonldRange,
  parseSchema,
  simplifyJsonldObject,
} from './parser'

jest.mock('./fetch')

describe('Parser service', () => {
  describe('getDocumentationUrlFromHeaders', () => {
    it('Should not return anything if the header is nolt present', () => {
      expect(
        getDocumentationUrlFromHeaders(
          new Headers({
            'Content-Type': 'application/ld+json',
          })
        )
      ).toEqual(undefined)
    })

    it('Should return the documentation URL from the headers', () => {
      expect(
        getDocumentationUrlFromHeaders(
          new Headers({
            'Content-Type': 'application/ld+json',
            link: '<http://localhost:3000/mocks/docs.jsonld>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"',
          })
        )
      ).toEqual('http://localhost:3000/mocks/docs.jsonld')
    })
  })

  describe('fetchDocs', () => {
    it('Should fetch the API shema', async () => {
      const result = await fetchDocs('http://localhost/')
      expect(result).toEqual({
        entrypoint: expect.objectContaining({
          '@type': ['https://localhost/docs.jsonld#Entrypoint'],
        }),
        entrypointUrl: 'http://localhost/',
        docs: expect.objectContaining({
          '@id': 'https://localhost/docs.jsonld',
        }),
        docsUrl: 'http://localhost/docs.jsonld',
      })
    })
  })

  describe('getSupportedClassMap', () => {
    it('Should get the supportedClass Map', () => {
      const map = getSupportedClassMap(expandedDocs)
      expect(map.get('https://localhost/docs.jsonld#Metadata')).toMatchObject({
        '@id': 'https://localhost/docs.jsonld#Metadata',
        '@type': ['http://www.w3.org/ns/hydra/core#Class'],
      })
    })
  })

  describe('isIJsonldRange', () => {
    it('Should return true id type is IJsonldRange', () => {
      expect(isIJsonldRange(expandedRange[0])).toEqual(false)
      expect(isIJsonldRange(expandedRange[1])).toEqual(true)
    })
  })

  describe('findRelatedClass', () => {
    it('should find the related class', () => {
      const map = getSupportedClassMap(expandedDocs)
      expect(findRelatedClass(map, expandedProperty)).toMatchObject({
        '@id': 'https://localhost/docs.jsonld#Metadata',
      })
    })
  })

  describe('simplifyJsonldObject', () => {
    it('should simplify the expanded syntax', () => {
      expect(
        simplifyJsonldObject({
          'http://www.w3.org/ns/hydra/core#supportedOperation': [
            {
              'http://www.w3.org/ns/hydra/core#type': [
                { 'http://www.w3.org/ns/hydra/core#@id': 'Type 1' },
              ],
              'http://www.w3.org/ns/hydra/core#title': [
                { '@value': 'Title 1' },
              ],
              'http://www.w3.org/ns/hydra/core#description': ['Description 1'],
              'http://www.w3.org/ns/hydra/core#range': [
                'Range 1-1',
                'Range 1-2',
              ],
              'http://www.w3.org/ns/hydra/core#name': { '@value': 'Name 1' },
              'http://www.w3.org/ns/hydra/core#label': 'Label 1',
            },
            {
              'http://www.w3.org/ns/hydra/core#type': [
                { 'http://www.w3.org/ns/hydra/core#@id': 'Type 2' },
              ],
              'http://www.w3.org/ns/hydra/core#title': [
                { '@value': 'Title 2' },
              ],
              'http://www.w3.org/ns/hydra/core#description': ['Description 2'],
              'http://www.w3.org/ns/hydra/core#range': [
                'Range 2-1',
                'Range 2-2',
              ],
              'http://www.w3.org/ns/hydra/core#name': { '@value': 'Name 2' },
              'http://www.w3.org/ns/hydra/core#label': 'Label 2',
            },
          ],
        })
      ).toEqual({
        supportedOperation: [
          {
            type: { '@id': 'Type 1' },
            title: 'Title 1',
            description: 'Description 1',
            range: ['Range 1-1', 'Range 1-2'],
            name: 'Name 1',
            label: 'Label 1',
          },
          {
            type: { '@id': 'Type 2' },
            title: 'Title 2',
            description: 'Description 2',
            range: ['Range 2-1', 'Range 2-2'],
            name: 'Name 2',
            label: 'Label 2',
          },
        ],
      })
    })
  })

  describe('parseSchema', () => {
    it('should parse and return the schema', async () => {
      const result = await parseSchema('http://localhost/')
      expect(result[5]).toMatchObject({
        '@id': 'https://localhost/docs.jsonld#Metadata',
        '@type': 'http://www.w3.org/ns/hydra/core#Class',
        title: 'Metadata',
        label: 'Metadata',
        url: 'https://localhost/metadata',
      })
    })
  })
})
