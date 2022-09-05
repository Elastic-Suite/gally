import { useTranslation } from 'next-i18next'
import { ReactChild, useMemo } from 'react'

import { ruleOptionsContext } from '~/contexts'
import { getOptionsFromEnum } from '~/services'
import {
  RuleAttributeOperator,
  RuleCombinationOperator,
  RuleType,
} from '~/types'

interface IProps {
  children: ReactChild
}

function RuleOptionsProvider(props: IProps): JSX.Element {
  const { children } = props
  const { t } = useTranslation('rules')

  const options = useMemo(() => {
    const options = new Map()
    options.set(RuleType.COMBINATION, {
      operator: getOptionsFromEnum(RuleCombinationOperator, t),
      value: [
        { value: true, label: t('true') },
        { value: false, label: t('false') },
      ],
    })
    options.set(RuleType.ATTRIBUTE, {
      field: [],
      operator: getOptionsFromEnum(RuleAttributeOperator, t),
      value: [
        { value: true, label: t('true') },
        { value: false, label: t('false') },
      ],
    })
    return options
  }, [t])

  return (
    <ruleOptionsContext.Provider value={options}>
      {children}
    </ruleOptionsContext.Provider>
  )
}

export default RuleOptionsProvider
