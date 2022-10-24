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
    return {
      ...rule,
      value: rule.value === 'true',
      children: rule.children.map((rule) => parseRule(rule, ruleOperators)),
    }
  } else if (isAttributeRule(rule)) {
    const valueType =
      ruleOperators.operatorsValueType[rule.attribute_type]?.[rule.operator]
    let ruleValue = rule.value
    if (
      valueType.startsWith('[') &&
      valueType.endsWith(']') &&
      rule.value instanceof Array
    ) {
      ruleValue = rule.value.join(ruleArrayValueSeparator)
    } else if (rule.attribute_type === RuleAttributeType.BOOLEAN) {
      ruleValue = rule.value === 'true'
    }
    return { ...rule, value: ruleValue }
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

export function serializeRule<R extends IRule>(
  rule: R,
  ruleOperators: IRuleEngineOperators
): R {
  if (isCombinationRule(rule)) {
    return {
      ...rule,
      value: String(rule.value),
      children: rule.children.map((rule) => serializeRule(rule, ruleOperators)),
    }
  } else if (isAttributeRule(rule)) {
    const valueType =
      ruleOperators.operatorsValueType[rule.attribute_type]?.[rule.operator]
    let ruleValue: string | string[] | number | number[] | boolean = String(
      rule.value
    )
    if (
      valueType.startsWith('[') &&
      valueType.endsWith(']') &&
      typeof rule.value === 'string'
    ) {
      ruleValue = rule.value.split(ruleArrayValueSeparator)
      if (ruleValueNumberTypes.includes(valueType.slice(1, -1))) {
        ruleValue = ruleValue.map(Number)
      } else {
        ruleValue = ruleValue.map(String)
      }
    } else if (ruleValueNumberTypes.includes(valueType)) {
      ruleValue = Number(rule.value)
    }
    return { ...rule, value: ruleValue }
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
