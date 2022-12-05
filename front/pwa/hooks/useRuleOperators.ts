import { useEffect, useState } from 'react'
import { IRuleEngineOperators, isError, isVirtualCategoryEnabled } from 'shared'

import { selectBundles, useAppSelector } from '~/store'

import { useApiFetch } from './useApi'

export function useRuleOperators(): IRuleEngineOperators {
  const [ruleOperators, setRuleOperators] = useState<IRuleEngineOperators>()
  const bundles = useAppSelector(selectBundles)
  const fetchApi = useApiFetch()

  useEffect(() => {
    if (isVirtualCategoryEnabled(bundles)) {
      fetchApi<IRuleEngineOperators>('rule_engine_operators').then((json) => {
        if (!isError(json)) {
          setRuleOperators(json)
        }
      })
    }
  }, [bundles, fetchApi])

  return ruleOperators
}
