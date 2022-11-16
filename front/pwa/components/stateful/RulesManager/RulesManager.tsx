import { useMemo } from 'react'

import { useApiList, useResource } from '~/hooks'
import {
  IRuleEngineOperators,
  ISourceField,
  ISourceFieldLabel,
  RuleAttributeType,
} from 'shared'

import CombinationRules, {
  ICombinationRulesProps,
} from '~/components/atoms/rules/CombinationRules'
import RuleOptionsProvider from '~/components/stateful-providers/RuleOptionsProvider/RuleOptionsProvider'

const sourceFieldFixedFilters = {
  'metadata.entity': 'product',
  isUsedForRules: true,
}

interface IProps extends ICombinationRulesProps {
  defaultLocalizedCatalog: string
  ruleOperators: IRuleEngineOperators
}

function RulesManager(props: IProps): JSX.Element {
  const {
    catalogId,
    defaultLocalizedCatalog,
    localizedCatalogId,
    ruleOperators,
    ...ruleProps
  } = props

  // Source fields
  const sourceFieldResource = useResource('SourceField')
  const filters = useMemo(
    () => ({
      ...sourceFieldFixedFilters,
      'type[]': Object.keys(ruleOperators.operatorsValueType),
    }),
    [ruleOperators.operatorsValueType]
  )
  const [sourceFields] = useApiList<ISourceField>(
    sourceFieldResource,
    false,
    undefined,
    filters
  )

  // Source field labels
  const sourceFieldLabelResource = useResource('SourceFieldLabel')
  const sourceFieldLabelFilters = useMemo(() => {
    const filters: { catalog?: string } = {}
    if (localizedCatalogId !== -1) {
      filters.catalog = `/localized_catalogs/${localizedCatalogId}`
    }
    return filters
  }, [localizedCatalogId])
  const [sourceFieldLabels] = useApiList<ISourceFieldLabel>(
    sourceFieldLabelResource,
    false,
    undefined,
    sourceFieldLabelFilters
  )

  if (!sourceFields.data || !sourceFieldLabels.data) {
    return null
  }

  const sourceFieldLabelsMap = new Map(
    sourceFieldLabels.data['hydra:member'].map((label) => [
      label.sourceField,
      label.label,
    ])
  )

  const fields = sourceFields.data['hydra:member'].map((field) => {
    const label = sourceFieldLabelsMap.get(`/source_fields/${field.id}`)
    return {
      id: field.id,
      code: field.code,
      label: (label || field.defaultLabel) ?? '',
      type: field.type as RuleAttributeType,
    }
  })

  return (
    <RuleOptionsProvider
      catalogId={catalogId}
      defaultLocalizedCatalog={defaultLocalizedCatalog}
      localizedCatalogId={localizedCatalogId}
      fields={fields}
      ruleOperators={ruleOperators}
    >
      <CombinationRules
        catalogId={catalogId}
        localizedCatalogId={localizedCatalogId}
        {...ruleProps}
      />
    </RuleOptionsProvider>
  )
}

RulesManager.defaultProps = {
  first: true,
}

export default RulesManager
