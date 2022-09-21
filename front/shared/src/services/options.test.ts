import { RuleAttributeOperator, RuleCombinationOperator } from '../types'

import { getOptionsFromEnum } from './options'

describe('Options service', () => {
  describe('getOptionsFromEnum', () => {
    it('should get the options from enum', () => {
      expect(getOptionsFromEnum(RuleCombinationOperator, (x) => x)).toEqual([
        { value: 'all', label: 'ALL' },
        { value: 'any', label: 'ANY' },
      ])
      expect(getOptionsFromEnum(RuleAttributeOperator, (x) => x)).toEqual(
        expect.arrayContaining([
          { value: 'is_one_of', label: 'IS_ONE_OF' },
          { value: 'is_not_one_of', label: 'IS_NOT_ONE_OF' },
          { value: 'gte', label: 'GTE' },
          { value: 'lte', label: 'LTE' },
          { value: 'eq', label: 'EQ' },
          { value: 'neq', label: 'NEQ' },
          { value: 'is', label: 'IS' },
        ])
      )
    })
  })
})
