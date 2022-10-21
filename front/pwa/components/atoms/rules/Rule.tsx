import { useContext } from 'react'
import { useTranslation } from 'next-i18next'

import { ruleOptionsContext } from '~/contexts'
import {
  IOptions,
  IRule,
  IRuleAttribute,
  ITreeItem,
  RuleAttributeType,
  RuleType,
  isAttributeRule,
  isCombinationRule,
} from 'shared'

import IonIcon from '../IonIcon/IonIcon'
import DropDown from '../form/DropDown'
import InputText from '../form/InputText'
import TreeSelector from '../form/TreeSelector'

import { Close, CustomCombination, Root } from './Rule.styled'

const numberTypes = [RuleAttributeType.FLOAT, RuleAttributeType.INT]

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
    options,
  } = useContext(ruleOptionsContext)
  const { t } = useTranslation('rules')

  function handleChange(property: string) {
    return (value: unknown): void => onChange({ ...rule, [property]: value })
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

  function getAttributeValueComponent(rule: IRuleAttribute): JSX.Element {
    const { attribute_type, field, value } = rule
    switch (attribute_type) {
      case RuleAttributeType.BOOLEAN: {
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
      }

      case RuleAttributeType.CATEGORY: {
        return (
          <TreeSelector
            data={
              (options.get(`type-${RuleAttributeType.CATEGORY}`) ??
                []) as ITreeItem[]
            }
            onChange={handleChange('value')}
            value={value as string[]}
          />
        )
      }

      case RuleAttributeType.SELECT: {
        return (
          <DropDown
            onChange={handleChange('value')}
            options={(options.get(field) ?? []) as IOptions<unknown>}
            required
            small
            value={value}
          />
        )
      }

      default: {
        const type = numberTypes.includes(attribute_type) ? 'number' : 'text'
        return (
          <InputText
            onChange={handleChange('value')}
            required
            small
            type={type}
            value={value as string}
          />
        )
      }
    }
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
          onChange={handleChange('operator')}
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
