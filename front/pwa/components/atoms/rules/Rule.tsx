import { useContext, useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { ruleOptionsContext } from '~/contexts'
import {
  IOptions,
  IRule,
  IRuleAttribute,
  ITreeItem,
  RuleAttributeType,
  RuleType,
  flatTree,
  isAttributeRule,
  isCombinationRule,
  ruleValueNumberTypes,
} from 'shared'

import IonIcon from '../IonIcon/IonIcon'
import DropDown from '../form/DropDown'
import InputText from '../form/InputText'
import TreeSelector from '../form/TreeSelector'

import { Close, CustomCombination, Root } from './Rule.styled'

interface IProps {
  onChange?: (rule: IRule) => void
  onDelete?: () => void
  rule: IRule
}

function Rule(props: IProps): JSX.Element {
  const { onChange, onDelete, rule } = props
  const {
    getAttributeOperatorOptions,
    getAttributeType,
    loadAttributeValueOptions,
    operatorsValueType,
    options,
  } = useContext(ruleOptionsContext)
  const { t } = useTranslation('rules')

  const categories = useMemo(
    () =>
      (options.get(`type-${RuleAttributeType.CATEGORY}`) ?? []) as ITreeItem[],
    [options]
  )
  const flatCategories: ITreeItem[] = useMemo(() => {
    const flat: ITreeItem[] = []
    flatTree(categories, flat)
    return flat
  }, [categories])

  function getInputType(rule: IRuleAttribute): 'number' | 'text' {
    const valueType = operatorsValueType[rule.attribute_type]?.[rule.operator]
    if (ruleValueNumberTypes.includes(valueType)) {
      return 'number'
    }
    return 'text'
  }

  function handleChange(property: string) {
    return (value: unknown): void => onChange({ ...rule, [property]: value })
  }

  function handleCategoryChange(value: ITreeItem[]): void {
    onChange({ ...rule, value: value.map((category) => category.id as string) })
  }

  function handleFieldChange(value: string): void {
    loadAttributeValueOptions(value)
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
    const prevType = getInputType(attributeRule)
    const newType = getInputType(newRule)
    onChange({
      ...newRule,
      value: prevType === newType ? rule.value : '',
    })
  }

  function getAttributeValueComponent(rule: IRuleAttribute): JSX.Element {
    const { attribute_type, field, value } = rule
    if (attribute_type === RuleAttributeType.BOOLEAN) {
      return (
        <DropDown
          onChange={handleChange('value')}
          options={
            (options.get(`type-${RuleAttributeType.BOOLEAN}`) ??
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
          options={(options.get(field) ?? []) as IOptions<unknown>}
          required
          small
          value={value}
        />
      )
    } else if (attribute_type === RuleAttributeType.CATEGORY) {
      const treeSelectorValue = flatCategories.filter((category) =>
        (value as string[]).includes(category.id as string)
      )
      return (
        <TreeSelector
          data={categories}
          required
          small
          onChange={handleCategoryChange}
          value={treeSelectorValue}
        />
      )
    }
    return (
      <InputText
        onChange={handleChange('value')}
        required
        small
        type={getInputType(rule)}
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
            (options.get(`type-${RuleAttributeType.BOOLEAN}`) ??
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
