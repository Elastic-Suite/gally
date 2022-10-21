import { useTranslation } from 'next-i18next'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'

import { ruleOptionsContext } from '~/contexts'
import { useResource, useSingletonLoader } from '~/hooks'
import {
  ICategories,
  IFetchApi,
  IHydraLabelMember,
  IHydraResponse,
  IOptions,
  IRuleEngineOperators,
  ITreeItem,
  RuleAttributeType,
  RuleCombinationOperator,
  RuleType,
  getListApiParameters,
  getOptionsFromEnum,
  getOptionsFromLabelResource,
  isError,
} from 'shared'

export interface IField {
  id: number | string
  code: string
  label: string
  type: RuleAttributeType
}

interface IProps {
  catalogId: number
  children: ReactNode
  fields: IField[]
  localizedCatalogId: number
  ruleOperators: IRuleEngineOperators
}

function RuleOptionsProvider(props: IProps): JSX.Element {
  const { catalogId, children, fields, localizedCatalogId, ruleOperators } =
    props
  const { operators, operatorsBySourceFieldType } = ruleOperators
  const sourceFieldOptionLabelResource = useResource('SourceFieldOptionLabel')
  const { t } = useTranslation('rules')
  const { fetch, map, setMap } = useSingletonLoader<
    IOptions<unknown> | ITreeItem[]
  >()

  useEffect(() => {
    setMap((options) => {
      const clone = new Map(options)
      clone.set(
        `${RuleType.COMBINATION}-operator`,
        getOptionsFromEnum(RuleCombinationOperator, t)
      )
      clone.set(`type-${RuleAttributeType.BOOLEAN}`, [
        { value: true, label: t('true') },
        { value: false, label: t('false') },
      ])
      return clone
    })
  }, [setMap, t])

  useEffect(() => {
    setMap((options) =>
      new Map(options).set(
        `${RuleType.ATTRIBUTE}-field`,
        fields.map((field) => ({
          value: field.code,
          label: field.label,
        }))
      )
    )
  }, [fields, setMap])

  const attributeOperatorOptions = useMemo(
    () =>
      Object.entries(operators).map(([operator, label]) => ({
        value: operator,
        label: t(`operator.${label}`),
        id: operator,
      })),
    [operators, t]
  )

  const getAttributeOperatorOptions = useCallback(
    (fieldCode: string) => {
      const field = fields.find(({ code }) => code === fieldCode)
      if (!field) {
        return []
      }
      const operators = operatorsBySourceFieldType[field.type]
      if (!operators) {
        return []
      }
      return attributeOperatorOptions.filter((option) =>
        operators.includes(option.value)
      )
    },
    [attributeOperatorOptions, fields, operatorsBySourceFieldType]
  )

  const getAttributeType = useCallback(
    (fieldCode: string) => {
      const field = fields.find(({ code }) => code === fieldCode)
      if (field) {
        return field.type
      }
    },
    [fields]
  )

  const loadAttributeValueOptions = useCallback(
    (fieldCode: string): void => {
      const field = fields.find(({ code }) => code === fieldCode)
      if (!field) {
        return
      }
      if (field.type === RuleAttributeType.CATEGORY) {
        return fetch(field.code, async (fetchApi: IFetchApi) => {
          const response = await fetchApi<ICategories>(
            `categoryTree?/&catalogId=${
              catalogId !== -1 ? catalogId : null
            }&localizedCatalogId=${
              localizedCatalogId !== -1 ? localizedCatalogId : null
            }`
          )
          if (!isError(response)) {
            return response.categories
          }
          throw new Error('error')
        })
      }
      if (field.type === RuleAttributeType.SELECT) {
        return fetch(field.code, async (fetchApi: IFetchApi) => {
          const response = await fetchApi<ICategories>(
            sourceFieldOptionLabelResource,
            getListApiParameters(false, undefined, {
              catalog: `/localized_catalogs/${
                localizedCatalogId !== -1 ? localizedCatalogId : null
              }`,
              'order[sourceFieldOption.position]': 'asc',
              'sourceFieldOption.sourceField': `/source_fields/${field.id}`,
            })
          )
          if (!isError(response)) {
            return getOptionsFromLabelResource(
              response as IHydraResponse<IHydraLabelMember>
            )
          }
          throw new Error('error')
        })
      }
    },
    [
      catalogId,
      fetch,
      fields,
      localizedCatalogId,
      sourceFieldOptionLabelResource,
    ]
  )

  const context = useMemo(
    () => ({
      getAttributeOperatorOptions,
      getAttributeType,
      loadAttributeValueOptions,
      options: map,
    }),
    [
      getAttributeOperatorOptions,
      getAttributeType,
      loadAttributeValueOptions,
      map,
    ]
  )

  return (
    <ruleOptionsContext.Provider value={context}>
      {children}
    </ruleOptionsContext.Provider>
  )
}

export default RuleOptionsProvider
