import {
  emptyCombinationRule,
  ruleArrayValueSeparator,
  ruleValueNumberTypes,
} from '../constants'
import {
  ICategoryConfiguration,
  IParsedCategoryConfiguration,
  IRule,
  IRuleAttribute,
  IRuleCombination,
  IRuleEngineOperators,
  RuleAttributeType,
  RuleType,
} from '../types'

export function isCombinationRule(rule: IRule): rule is IRuleCombination {
  return rule.type === RuleType.COMBINATION
}

export function isAttributeRule(rule: IRule): rule is IRuleAttribute {
  return rule.type === RuleType.ATTRIBUTE
}

function parseRule<R extends IRule>(
  rule: R,
  ruleOperators: IRuleEngineOperators
): R {
  if (isCombinationRule(rule)) {
    rule.children = rule.children.map((rule) => parseRule(rule, ruleOperators))
    rule.value = rule.value === 'true'
    return rule
  } else if (isAttributeRule(rule)) {
    const valueType =
      ruleOperators.operatorsValueType[rule.attribute_type]?.[rule.operator]
    if (
      valueType.startsWith('[') &&
      valueType.endsWith(']') &&
      rule.value instanceof Array
    ) {
      rule.value = rule.value.join(ruleArrayValueSeparator)
    } else if (rule.attribute_type === RuleAttributeType.BOOLEAN) {
      rule.value = rule.value === 'true'
    }
    return rule
  }
  return rule
}

export function parseCatConf(
  catConf: ICategoryConfiguration,
  ruleOperators: IRuleEngineOperators
): IParsedCategoryConfiguration {
  let virtualRule: IRuleCombination
  try {
    virtualRule = parseRule(JSON.parse(catConf.virtualRule), ruleOperators)
  } catch {
    virtualRule = emptyCombinationRule
  }
  return { ...catConf, virtualRule }
}

function serializeRule<R extends IRule>(
  rule: R,
  ruleOperators: IRuleEngineOperators
): R {
  if (isCombinationRule(rule)) {
    rule.children = rule.children.map((rule) =>
      serializeRule(rule, ruleOperators)
    )
    rule.value = String(rule.value)
    return rule
  } else if (isAttributeRule(rule)) {
    const valueType =
      ruleOperators.operatorsValueType[rule.attribute_type]?.[rule.operator]
    if (
      valueType.startsWith('[') &&
      valueType.endsWith(']') &&
      typeof rule.value === 'string'
    ) {
      rule.value = rule.value.split(ruleArrayValueSeparator)
      if (ruleValueNumberTypes.includes(valueType.slice(1, -1))) {
        rule.value = rule.value.map(Number)
      } else {
        rule.value = rule.value.map(String)
      }
    } else if (ruleValueNumberTypes.includes(valueType)) {
      rule.value = Number(rule.value)
    } else {
      rule.value = String(rule.value)
    }
    return rule
  }
  return rule
}

export function serializeCatConf(
  catConf: IParsedCategoryConfiguration,
  ruleOperators: IRuleEngineOperators
): ICategoryConfiguration {
  return {
    ...catConf,
    virtualRule: JSON.stringify(
      serializeRule(catConf.virtualRule, ruleOperators)
    ),
  }
}
