import { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import {
  IOptions,
  IRule,
  IRuleAttribute,
  ITreeItem,
  RuleAttributeType,
  RuleType,
  RuleValueType,
  flatTree,
  getAttributeRuleValueType,
  isAttributeRule,
  isAttributeRuleValueMultiple,
  isCombinationRule,
  ruleValueNumberTypes,
} from 'shared'

import { ruleOptionsContext } from '~/contexts'

import IonIcon from '../IonIcon/IonIcon'
import DropDown from '../form/DropDown'
import InputText from '../form/InputText'
import TreeSelector from '../form/TreeSelector'

import { Close, CustomCombination, Root } from './Rule.styled'

function getInputType(valueType: RuleValueType): 'number' | 'text' {
  if (ruleValueNumberTypes.includes(valueType)) {
    return 'number'
  }
  return 'text'
}

interface IProps {
  catalogId: number
  localizedCatalogId: number
  onChange?: (rule: IRule) => void
  onDelete?: () => void
  rule: IRule
}

function Rule(props: IProps): JSX.Element {
  const { catalogId, localizedCatalogId, onChange, onDelete, rule } = props
  const {
    getAttributeOperatorOptions,
    getAttributeType,
    loadAttributeValueOptions,
    operatorsValueType,
    options,
  } = useContext(ruleOptionsContext)
  const { t } = useTranslation('rules')

  useEffect(() => {
    if (isAttributeRule(rule)) {
      loadAttributeValueOptions(rule.field)
    }
  }, [loadAttributeValueOptions, rule])

  const categories = useMemo(
    () =>
      (options.get(
        `type-${RuleAttributeType.CATEGORY}-${catalogId}-${localizedCatalogId}`
      ) ?? []) as ITreeItem[],
    [catalogId, localizedCatalogId, options]
  )
  const flatCategories: ITreeItem[] = useMemo(() => {
    const flat: ITreeItem[] = []
    flatTree(categories, flat)
    return flat
  }, [categories])

  function handleChange(property: string) {
    return (value: unknown): void => onChange({ ...rule, [property]: value })
  }

  function handleCategoryChange(value: ITreeItem | ITreeItem[]): void {
    if (value instanceof Array) {
      onChange({
        ...rule,
        value: value.map((category) => category.id as string),
      })
    } else {
      onChange({ ...rule, value: value.id })
    }
  }

  function handleFieldChange(value: string): void {
    onChange({
      ...rule,
      attribute_type: getAttributeType(value) ?? '',
      field: value ?? '',
      value: '',
    } as IRuleAttribute)
  }

  function handleOperatorChange(operator: string): void {
    const attributeRule = rule as IRuleAttribute
    const newRule: IRuleAttribute = {
      ...attributeRule,
      operator,
    }
    const prevType = getAttributeRuleValueType(
      attributeRule,
      operatorsValueType
    )
    const newType = getAttributeRuleValueType(newRule, operatorsValueType)
    onChange({
      ...newRule,
      value: prevType === newType ? rule.value : '',
    })
  }

  function getAttributeValueComponent(rule: IRuleAttribute): JSX.Element {
    const { attribute_type, field, value } = rule
    const valueType = getAttributeRuleValueType(rule, operatorsValueType)
    if (valueType === RuleValueType.BOOLEAN) {
      return (
        <DropDown
          onChange={handleChange('value')}
          options={
            (options.get(`type-${RuleValueType.BOOLEAN}`) ??
              []) as IOptions<boolean>
          }
          required
          small
          value={value}
        />
      )
    } else if (attribute_type === RuleAttributeType.SELECT) {
      return (
        <DropDown
          onChange={handleChange('value')}
          options={
            (options.get(`${field}-${localizedCatalogId}`) ??
              []) as IOptions<unknown>
          }
          required
          small
          value={value}
        />
      )
    } else if (attribute_type === RuleAttributeType.CATEGORY) {
      const treeSelectorValue =
        value instanceof Array
          ? flatCategories.filter((category) =>
              (value as string[]).includes(category.id as string)
            )
          : flatCategories.find((category) => value === category.id) ?? null
      return (
        <TreeSelector
          data={categories}
          multiple={isAttributeRuleValueMultiple(valueType)}
          onChange={handleCategoryChange}
          required
          small
          value={treeSelectorValue}
        />
      )
    }
    return (
      <InputText
        onChange={handleChange('value')}
        required
        small
        type={getInputType(valueType)}
        value={value as string}
      />
    )
  }

  let content
  if (isCombinationRule(rule)) {
    const { operator, value } = rule
    content = (
      <>
        <DropDown
          onChange={handleChange('operator')}
          options={
            (options.get(`${RuleType.COMBINATION}-operator`) ??
              []) as IOptions<string>
          }
          required
          small
          value={operator}
        />
        <CustomCombination>{t('conditionsAre')}</CustomCombination>
        <DropDown
          onChange={handleChange('value')}
          options={
            (options.get(`type-${RuleValueType.BOOLEAN}`) ??
              []) as IOptions<boolean>
          }
          required
          small
          value={value}
        />
      </>
    )
  } else if (isAttributeRule(rule)) {
    const { field, operator } = rule
    content = (
      <>
        <DropDown
          onChange={handleFieldChange}
          options={
            (options.get(`${RuleType.ATTRIBUTE}-field`) ??
              []) as IOptions<string>
          }
          required
          value={field}
          small
        />
        <DropDown
          onChange={handleOperatorChange}
          options={getAttributeOperatorOptions(field)}
          required
          small
          transparent
          value={operator}
        />
        {getAttributeValueComponent(rule)}
      </>
    )
  }

  return (
    <Root>
      {content}
      <Close onClick={onDelete}>
        <IonIcon name="close" style={{ fontSize: '17.85px' }} />
      </Close>
    </Root>
  )
}

export default Rule
