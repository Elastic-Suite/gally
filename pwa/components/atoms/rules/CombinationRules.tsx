import { Fragment } from 'react'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'

import { isAttributeRule, isCombinationRule } from '~/services'
import { IRule, IRuleCombination, RuleCombinationOperator } from '~/types'

import TertiaryButton from '../buttons/TertiaryButton'
import IonIcon from '../IonIcon/IonIcon'

import Rule from './Rule'
import RuleLink from './RuleLink'

const RuleAndLinkContainer = styled('div')(({ theme }) => ({
  gap: theme.spacing(1),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
}))

const BorderBox = styled('div')(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingRight: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  width: 'min-content',
  alignItems: 'baseline',
  boxShadow: theme.palette.colors.shadow.neutral.sm,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

const RootWithBorder = styled(BorderBox)(({ theme }) => ({
  gap: theme.spacing(2),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}))

const RootWithoutBorder = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
}))

const ChildWithBorder = styled(BorderBox)(() => ({
  marginLeft: '40px',
}))

const RuleLinkPlaceholder = styled('div')(() => ({
  width: '32px',
}))

interface IProps {
  first?: boolean
  onChange?: (rule: IRuleCombination) => void
  onDelete?: () => void
  rule?: IRuleCombination
}

function CombinationRules(props: IProps): JSX.Element {
  const { first, onChange, onDelete, rule } = props
  const { children, operator } = rule
  const { t } = useTranslation('rules')

  const Root = first ? RootWithoutBorder : RootWithBorder
  const Child = first ? Fragment : ChildWithBorder

  function handleChildChange(key: number) {
    return (childRule: IRule) =>
      onChange({
        ...rule,
        children: children.map((item: IRule, index: number) =>
          index === key ? childRule : item
        ),
      })
  }

  function handleChildDelete(key: number) {
    return () =>
      onChange({
        ...rule,
        children: children.filter((_: IRule, index: number) => index !== key),
      })
  }

  return (
    <Root>
      <RuleAndLinkContainer>
        <RuleLink label="if" />
        <Rule onChange={onChange} onDelete={onDelete} rule={rule} />
      </RuleAndLinkContainer>
      {Boolean(children) && (
        <Child>
          {children.map((item: IRule, key: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <RuleAndLinkContainer key={key}>
              {key !== children.length - 1 ? (
                <RuleLink
                  double
                  label={
                    operator === RuleCombinationOperator.ALL ? 'and' : 'or'
                  }
                  merge={key !== 0}
                />
              ) : (
                <RuleLinkPlaceholder />
              )}
              {isCombinationRule(item) ? (
                <CombinationRules
                  onChange={handleChildChange(key)}
                  onDelete={handleChildDelete(key)}
                  rule={item}
                />
              ) : isAttributeRule(item) ? (
                <Rule
                  onChange={handleChildChange(key)}
                  onDelete={handleChildDelete(key)}
                  rule={item}
                />
              ) : null}
            </RuleAndLinkContainer>
          ))}
          <TertiaryButton
            style={{ whiteSpace: 'nowrap', marginLeft: first ? '40px' : 0 }}
          >
            <IonIcon
              name="add"
              style={{ marginRight: '4px', fontSize: '19px' }}
            />
            {t('addCondition')}
          </TertiaryButton>
        </Child>
      )}
    </Root>
  )
}

export default CombinationRules
