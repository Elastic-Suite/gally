import { useTranslation } from 'next-i18next'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'

import { ruleOptionsContext } from '~/contexts'
import { useResource, useSingletonLoader } from '~/hooks'
import {
  ICategories,
  IError,
  IFetchApi,
  IHydraResponse,
  IOptions,
  IRuleEngineOperators,
  ISourceFieldOptionLabel,
  ITreeItem,
  RuleAttributeType,
  RuleCombinationOperator,
  RuleType,
  RuleValueType,
  getListApiParameters,
  getOptionsFromEnum,
  getOptionsFromOptionLabelResource,
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
  defaultLocalizedCatalog: string
  fields: IField[]
  localizedCatalogId: number
  ruleOperators: IRuleEngineOperators
}

function RuleOptionsProvider(props: IProps): JSX.Element {
  const {
    catalogId,
    children,
    defaultLocalizedCatalog,
    fields,
    localizedCatalogId,
    ruleOperators,
  } = props
  const { operators, operatorsBySourceFieldType, operatorsValueType } =
    ruleOperators
  const sourceFieldOptionLabelResource = useResource('SourceFieldOptionLabel')
  const { t } = useTranslation('rules')
  const { fetch, map, setMap } = useSingletonLoader<
    IOptions<unknown> | ITreeItem[]
  >()

  // Add boolean options (we have to use useEffect for translation)
  useEffect(() => {
    setMap((options) => {
      const clone = new Map(options)
      clone.set(
        `${RuleType.COMBINATION}-operator`,
        getOptionsFromEnum(RuleCombinationOperator, t)
      )
      clone.set(`type-${RuleValueType.BOOLEAN}`, [
        { value: true, label: t('true') },
        { value: false, label: t('false') },
      ])
      return clone
    })
  }, [setMap, t])

  // Add list of fields
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
        // Fetch categories for current catalog/localizedCatalog
        return fetch(
          `type-${RuleAttributeType.CATEGORY}-${catalogId}-${localizedCatalogId}`,
          async (fetchApi: IFetchApi) => {
            const filters: { catalogId?: number; localizedCatalogId?: number } =
              {}
            if (catalogId !== -1) {
              filters.catalogId = catalogId
            }
            if (localizedCatalogId !== -1) {
              filters.localizedCatalogId = localizedCatalogId
            }
            const response = await fetchApi<ICategories>(
              'categoryTree',
              filters
            )
            if (!isError(response)) {
              return response.categories
            }
            throw new Error('error')
          }
        )
      }
      if (field.type === RuleAttributeType.SELECT) {
        return fetch(
          `${field.code}-${localizedCatalogId}`,
          async (fetchApi: IFetchApi) => {
            const optionLabelFilters: {
              catalog?: string
              'order[sourceFieldOption.position]': string
              'sourceFieldOption.sourceField': string
            } = {
              'order[sourceFieldOption.position]': 'asc',
              'sourceFieldOption.sourceField': `/source_fields/${field.id}`,
            }
            let optionLabelsResponse:
              | IError
              | IHydraResponse<ISourceFieldOptionLabel>

            // Fetch sourceFieldOptionLabels for current localizedCatalog
            if (localizedCatalogId !== -1) {
              optionLabelFilters.catalog = `/localized_catalogs/${localizedCatalogId}`
              optionLabelsResponse = await fetchApi<
                IHydraResponse<ISourceFieldOptionLabel>
              >(
                sourceFieldOptionLabelResource,
                getListApiParameters(false, undefined, optionLabelFilters)
              )
            }

            // Fetch sourceFieldOptionLabels for default catalog (if no labels were found)
            if (
              !optionLabelsResponse ||
              isError(optionLabelsResponse) ||
              optionLabelsResponse['hydra:totalItems'] === 0
            ) {
              optionLabelFilters.catalog = `/localized_catalogs/${defaultLocalizedCatalog}`
              optionLabelsResponse = await fetchApi<
                IHydraResponse<ISourceFieldOptionLabel>
              >(
                sourceFieldOptionLabelResource,
                getListApiParameters(false, undefined, optionLabelFilters)
              )
            }

            if (!isError(optionLabelsResponse)) {
              return getOptionsFromOptionLabelResource(optionLabelsResponse)
            }
            throw new Error('error')
          }
        )
      }
    },
    [
      catalogId,
      defaultLocalizedCatalog,
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
      operatorsValueType,
      options: map,
    }),
    [
      getAttributeOperatorOptions,
      getAttributeType,
      loadAttributeValueOptions,
      map,
      operatorsValueType,
    ]
  )

  return (
    <ruleOptionsContext.Provider value={context}>
      {children}
    </ruleOptionsContext.Provider>
  )
}

export default RuleOptionsProvider
