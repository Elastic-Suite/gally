import { ICatalog } from '~/types'
import { findDefaultCatalog } from './catalog'

const defaultCatalog = {
  '@type': 'test',
  '@id': 'test',
  id: 11,
  name: 'test11',
  code: 'test11',
  locale: 'test',
  isDefault: true,
  localName: 'test11',
}

const defaultCatalog2 = {
  '@type': 'test2',
  '@id': 'test2',
  id: 12,
  name: 'test12',
  code: 'test12',
  locale: 'test2',
  isDefault: true,
  localName: 'test12',
}

const mockCatalogs: ICatalog[] = [
  {
    '@type': 'test',
    '@id': 'test',
    id: 1,
    code: 'test',
    name: 'test',
    localizedCatalogs: [
      defaultCatalog,
      {
        '@type': 'test',
        '@id': 'test',
        id: 11,
        name: 'test11',
        code: 'test11',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
    ],
  },
  {
    '@type': 'test',
    '@id': 'test',
    id: 2,
    code: 'test2',
    name: 'test2',
    localizedCatalogs: [
      {
        '@type': 'test',
        '@id': 'test',
        id: 11,
        name: 'test11',
        code: 'test11',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
      {
        '@type': 'test',
        '@id': 'test',
        id: 11,
        name: 'test11',
        code: 'test11',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
    ],
  },
]

const mockCatalogsWithTwoDefault: ICatalog[] = [
  {
    '@type': 'test',
    '@id': 'test',
    id: 1,
    code: 'test',
    name: 'test',
    localizedCatalogs: [
      defaultCatalog,
      {
        '@type': 'test',
        '@id': 'test',
        id: 11,
        name: 'test11',
        code: 'test11',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
    ],
  },
  {
    '@type': 'test',
    '@id': 'test',
    id: 2,
    code: 'test2',
    name: 'test2',
    localizedCatalogs: [
      defaultCatalog2,
      {
        '@type': 'test',
        '@id': 'test',
        id: 11,
        name: 'test11',
        code: 'test11',
        locale: 'test',
        isDefault: false,
        localName: 'test11',
      },
    ],
  },
]

describe('Catalog service', () => {
  it('should return default catalog', () => {
    expect(findDefaultCatalog(mockCatalogs)).toEqual({
      '@type': 'test',
      '@id': 'test',
      id: 1,
      code: 'test',
      name: 'test',
      localizedCatalogs: [defaultCatalog],
    })
  })
  it('should return first default catalogs in case of several default catalogs are present', () => {
    expect(findDefaultCatalog(mockCatalogsWithTwoDefault)).toEqual({
      '@type': 'test',
      '@id': 'test',
      id: 1,
      code: 'test',
      name: 'test',
      localizedCatalogs: [defaultCatalog],
    })
  })
})
