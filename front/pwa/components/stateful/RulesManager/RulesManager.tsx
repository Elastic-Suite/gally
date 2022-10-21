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
}

interface IProps extends ICombinationRulesProps {
  catalogId: number
  localizedCatalogId: number
  ruleOperators: IRuleEngineOperators
}

function RulesManager(props: IProps): JSX.Element {
  const { catalogId, localizedCatalogId, ...ruleProps } = props
  // Fixme: use dedicated API endpoint to load the list of fields ?
  const sourceFieldResource = useResource('SourceField')
  const [sourceFields] = useApiList<ISourceField>(
    sourceFieldResource,
    false,
    undefined,
    sourceFieldFixedFilters
  )

  const sourceFieldLabelResource = useResource('SourceFieldLabel')
  const sourceFieldLabelFilters = useMemo(
    () => ({
      catalog: `/localized_catalogs/${
        localizedCatalogId !== -1 ? localizedCatalogId : null
      }`,
    }),
    [localizedCatalogId]
  )
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
      localizedCatalogId={localizedCatalogId}
      fields={fields}
    >
      <CombinationRules {...ruleProps} />
    </RuleOptionsProvider>
  )
}

RulesManager.defaultProps = {
  first: true,
}

export default RulesManager
