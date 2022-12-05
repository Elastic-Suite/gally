import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'
import {
  ICategory,
  IParsedCategoryConfiguration,
  IProductFieldFilterInput,
  IRuleEngineGraphqlFilters,
  IRuleEngineOperators,
  isError,
  isRuleValid,
  isVirtualCategoryEnabled,
  serializeRule,
} from 'shared'

import { selectBundles, useAppSelector } from '~/store'

import { useApiFetch } from './useApi'

const debounceDelay = 200

export function useRuleEngineGraphqlFilters(
  catConf: IParsedCategoryConfiguration,
  ruleOperators: IRuleEngineOperators,
  selectedCategoryItem: ICategory
): [
  IProductFieldFilterInput,
  Dispatch<SetStateAction<IProductFieldFilterInput>>
] {
  const bundles = useAppSelector(selectBundles)
  const fetchApi = useApiFetch()
  const [ruleEngineGraphqlFilters, setRuleEngineGraphqlFilters] =
    useState<IProductFieldFilterInput>(null)
  const isEnabled = isVirtualCategoryEnabled(bundles)
  const isValid = !catConf?.isVirtual || isRuleValid(catConf?.virtualRule)

  const debouncedFetch = useMemo(
    () =>
      debounce(async (rule: string): Promise<void> => {
        const json = await fetchApi<IRuleEngineGraphqlFilters>(
          'rule_engine_graphql_filters',
          undefined,
          { body: JSON.stringify({ rule }), method: 'POST' }
        )
        if (!isError(json)) {
          setRuleEngineGraphqlFilters(json.graphQlFilters)
        }
      }, debounceDelay),
    [fetchApi]
  )

  useEffect(() => {
    if (isEnabled && catConf?.isVirtual && catConf?.virtualRule && isValid) {
      debouncedFetch(
        JSON.stringify(serializeRule(catConf.virtualRule, ruleOperators))
      )
    }
  }, [
    bundles,
    catConf?.isVirtual,
    catConf?.virtualRule,
    debouncedFetch,
    isEnabled,
    isValid,
    ruleOperators,
  ])

  const productGraphqlFilters: IProductFieldFilterInput = useMemo(() => {
    if (isEnabled && catConf?.isVirtual && ruleEngineGraphqlFilters) {
      return ruleEngineGraphqlFilters
    } else if ((!catConf?.isVirtual || !isEnabled) && selectedCategoryItem) {
      return { category__id: { eq: selectedCategoryItem.id } }
    }
    return null
  }, [catConf, isEnabled, ruleEngineGraphqlFilters, selectedCategoryItem])

  return [productGraphqlFilters, setRuleEngineGraphqlFilters]
}
