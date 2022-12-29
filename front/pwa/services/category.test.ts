import { ICategory } from 'gally-admin-shared'

import { findCategory } from './category'

describe('Category service', () => {
  describe('findCategory', () => {
    it('Should find the category in new list of category', () => {
      const category = { id: 42, foo: 'bar' }
      const categories = [
        { id: 1, children: [{ id: 10 }] },
        { id: 2 },
        { id: 3, children: [{ id: 30 }, { id: 31 }] },
        {
          id: 4,
          children: [
            { id: 40 },
            { id: 41 },
            { id: 42, foo: 'baz' },
            { id: 43 },
          ],
        },
        { id: 5, children: [{ id: 50 }] },
      ]
      expect(
        findCategory(
          category as unknown as ICategory,
          categories as unknown as ICategory[]
        )
      ).toEqual({ id: 42, foo: 'baz' })
    })
  })
})
