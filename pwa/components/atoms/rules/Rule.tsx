import { useContext } from 'react'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'

import { ruleOptionsContext } from '~/contexts'
import { isAttributeRule, isCombinationRule } from '~/services'
import { IRule, RuleAttributeType, RuleType } from '~/types'

import IonIcon from '../IonIcon/IonIcon'
import DropDown from '../form/DropDown'
import InputText from '../form/InputText'

const Root = styled('div')(({ theme }) => ({
  height: '42px',
  boxSizing: 'border-box',
  background: theme.palette.colors.neutral['200'],
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  width: 'fit-content',
  border: '1px solid',
  borderColor: theme.palette.colors.neutral['300'],
  borderRadius: theme.spacing(1),
  alignItems: 'center',
  gap: theme.spacing(0.5),
}))

const Close = styled('div')(({ theme }) => ({
  display: 'flex',
  cursor: 'pointer',
  transition: 'all 500ms',
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  color: theme.palette.colors.neutral['600'],
  '&:hover': {
    background: theme.palette.colors.neutral['300'],
  },
}))

const CustomCombination = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  fontFamily: 'Inter',
  color: theme.palette.colors.neutral['900'],
  fontWeight: 400,
  lineHeight: '18px',
  fontSize: '12px',
  width: 'max-content',
}))

interface IProps {
  onChange?: (rule: IRule) => void
  onDelete?: () => void
  rule: IRule
}

function Rule(props: IProps): JSX.Element {
  const { onChange, onDelete, rule } = props
  const options = useContext(ruleOptionsContext)
  const { t } = useTranslation('rules')

  function handleChange(property: string) {
    return (value: unknown): void => onChange({ ...rule, [property]: value })
  }

  let firstBlock
  let secondBlock
  let thirdBlock

  if (isCombinationRule(rule)) {
    const { operator, value } = rule
    const { operator: operatorOptions, value: valueOptions } = options.get(
      RuleType.COMBINATION
    )
    firstBlock = (
      <DropDown
        onChange={handleChange('operator')}
        options={operatorOptions}
        required
        small
        value={operator}
      />
    )
    secondBlock = <CustomCombination>{t('conditionsAre')}</CustomCombination>
    thirdBlock = (
      <DropDown
        onChange={handleChange('value')}
        options={valueOptions}
        required
        small
        value={value}
      />
    )
  } else if (isAttributeRule(rule)) {
    const { attribute_type, field, operator, value } = rule
    const {
      field: fieldOptions,
      operator: operatorOptions,
      value: valueOptions,
    } = options.get(RuleType.ATTRIBUTE)
    firstBlock = (
      <DropDown
        onChange={handleChange('field')}
        options={fieldOptions}
        required
        value={field}
        small
      />
    )
    secondBlock = (
      <DropDown
        onChange={handleChange('operator')}
        options={operatorOptions}
        required
        small
        transparent
        value={operator}
      />
    )
    switch (attribute_type) {
      case RuleAttributeType.SELECT:
        thirdBlock = (
          <DropDown
            onChange={handleChange('value')}
            options={valueOptions}
            required
            small
            value={value}
          />
        )
        break

      default:
        thirdBlock = (
          <InputText
            onChange={handleChange('value')}
            required
            small
            type={
              attribute_type === RuleAttributeType.FLOAT ? 'number' : 'text'
            }
            value={value}
          />
        )
        break
    }
  }

  return (
    <Root>
      {firstBlock}
      {secondBlock}
      {thirdBlock}
      <Close onClick={onDelete}>
        <IonIcon name="close" style={{ fontSize: '17.85px' }} />
      </Close>
    </Root>
  )
}

export default Rule
