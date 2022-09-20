import { findBreadcrumbLabel, getSlugArray } from './breadcrumb'

import menu from '../mocks/static/menu.json'

describe('Breadcrumb service', () => {
  describe('getSlugArray', () => {
    it('should return the slug array from array', () => {
      expect(getSlugArray(['a', 'b', 'c'])).toEqual(['a', 'a_b', 'a_b_c'])
    })

    it('should return the slug array from string', () => {
      expect(getSlugArray('a')).toEqual(['a'])
    })
  })

  describe('findBreadcrumbLabel', () => {
    it('should find the breadcrumb label', () => {
      expect(findBreadcrumbLabel(0, ['dashboard'], menu.hierarchy)).toEqual(
        'Tableau de bord'
      )
    })

    it('should deeply find the breadcrumb label', () => {
      expect(
        findBreadcrumbLabel(
          2,
          [
            'merchandize',
            'merchandize_recommender',
            'merchandize_recommender_configuration',
          ],
          menu.hierarchy
        )
      ).toEqual('Configuration générale')
    })

    it('should return null if the label is not found', () => {
      expect(findBreadcrumbLabel(0, ['foo'], menu.hierarchy)).toEqual(null)
    })
  })
})
