import { useCallback, useContext, useMemo } from 'react'

import {
  IApiSchemaOptions,
  IFetchApi,
  IField,
  IHydraMember,
  IHydraResponse,
  IOptions,
  IOptionsContext,
  getOptionsFromApiSchema,
  getOptionsFromResource,
  getReferencedResource,
  hasFieldOptions,
  isDropdownStaticOptions,
  isError,
  isReferenceField,
  schemaContext,
} from 'shared'
import { useSingletonLoader } from './useSingletonLoader'

export function useOptions(): IOptionsContext {
  const { fetch, map, statuses } =
    useSingletonLoader<IOptions<string | number>>()
  const api = useContext(schemaContext)

  const load = useCallback(
    (field: IField) => {
      const id = field.property['@id']
      return fetch(id, async (fetchApi: IFetchApi<unknown>) => {
        if (hasFieldOptions(field)) {
          // get options from the schema
          if (isDropdownStaticOptions(field.elasticsuite?.options)) {
            // static options
            if (field.elasticsuite.options.values instanceof Array) {
              const options = field.elasticsuite.options.values.map(
                (option) => ({
                  label: String(option),
                  value: option,
                })
              )
              return options
            }
            const options = Object.entries(
              field.elasticsuite.options.values
            ).map(([value, label]) => ({ label, value }))
            return options
          }
          // options from api
          const response = await fetchApi(field.elasticsuite.options.api_rest)
          if (!isError(response)) {
            return getOptionsFromApiSchema(
              response as IHydraResponse<IApiSchemaOptions>
            )
          }
          throw new Error('error')
        } else if (isReferenceField(field)) {
          // get options by loading all items of the referenced field
          const response = await fetchApi(
            getReferencedResource(api, field)?.url
          )
          if (!isError(response)) {
            return getOptionsFromResource(
              response as IHydraResponse<IHydraMember>
            )
          }
          throw new Error('error')
        }
      })
    },
    [api, fetch]
  )

  return useMemo(
    () => ({ fieldOptions: map, load, statuses }),
    [load, map, statuses]
  )
}
