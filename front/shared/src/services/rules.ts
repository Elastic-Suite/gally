import { IRule, IRuleAttribute, IRuleCombination, RuleType } from '../types'

export function isCombinationRule(rule: IRule): rule is IRuleCombination {
  return rule.type === RuleType.COMBINATION
}

export function isAttributeRule(rule: IRule): rule is IRuleAttribute {
  return rule.type === RuleType.ATTRIBUTE
}
