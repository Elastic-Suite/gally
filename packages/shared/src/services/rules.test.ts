import { attributeRule, combinationRule } from '../mocks'

import { isAttributeRule, isCombinationRule } from './rules'

describe('Rules service', () => {
  describe('isAttributeRule', () => {
    it('should check if rule is an attribute rule', () => {
      expect(isAttributeRule(attributeRule)).toEqual(true)
      expect(isAttributeRule(combinationRule)).toEqual(false)
    })
  })

  describe('isCombinationRule', () => {
    it('should check if rule is a combination rule', () => {
      expect(isCombinationRule(attributeRule)).toEqual(false)
      expect(isCombinationRule(combinationRule)).toEqual(true)
    })
  })
})
