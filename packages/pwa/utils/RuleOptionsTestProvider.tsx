import { ReactNode } from 'react'

import sourceFields from '~/public/mocks/source_fields.json'
import sourceFieldLabels from '~/public/mocks/source_field_labels.json'
import { RuleAttributeType } from 'shared'

import RuleOptionsProvider from '~/components/stateful-providers/RuleOptionsProvider/RuleOptionsProvider'

interface IProps {
  children: ReactNode
}

const sourceFieldLabelsMap = new Map(
  sourceFieldLabels['hydra:member'].map((label) => [
    label.sourceField,
    label.label,
  ])
)

const fields = sourceFields['hydra:member'].map((field) => {
  const label = sourceFieldLabelsMap.get(`/source_fields/${field.id}`)
  return {
    id: field.id,
    code: field.code,
    label: (label || field.defaultLabel) ?? '',
    type: field.type as RuleAttributeType,
  }
})

function RuleOptionsTestProvider(props: IProps): JSX.Element {
  const { children } = props
  return (
    <RuleOptionsProvider catalogId={-1} localizedCatalogId={-1} fields={fields}>
      {children}
    </RuleOptionsProvider>
  )
}

export default RuleOptionsTestProvider
