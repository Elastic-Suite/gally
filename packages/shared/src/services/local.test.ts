import { ICatalog } from '../types'
import { getUniqueLocalName } from './local'

describe('Local service', () => {
  describe('getUniqueLocalName', () => {
    it('Should get unique local name from a catalog', () => {
      const catalog = {
        localizedCatalogs: [
          {
            localName: 'name1',
          },
          {
            localName: 'name2',
          },
        ],
      } as unknown as ICatalog

      expect(getUniqueLocalName(catalog)).toEqual(['name1', 'name2'])
    })
  })
})
