import { useCallback, useContext } from 'react'

import { schemaContext } from '~/contexts'
import {
  getOptionsFromApiSchema,
  getOptionsFromResource,
  getReferencedResource,
  hasFieldOptions,
  isDropdownStaticOptions,
  isFetchError,
  isReferenceField,
} from '~/services'
import {
  IApiSchemaOptions,
  IFetchApi,
  IField,
  IHydraMember,
  IHydraResponse,
  IOptions,
  IOptionsContext,
} from '~/types'
import { useSingletonLoader } from './useSingletonLoader'

export function useOptions(): IOptionsContext {
  const { fetch, map } = useSingletonLoader<IOptions<string | number>>()
  const api = useContext(schemaContext)

  const load = useCallback(
    (field: IField) => {
      const id = field.property['@id']
      return fetch(id, async (fetchApi: IFetchApi<unknown>) => {
        if (hasFieldOptions(field)) {
          // get options from the schema
          if (isDropdownStaticOptions(field.elasticsuite?.options)) {
            // static options
            const options = field.elasticsuite.options.values.map((option) => ({
              label: String(option),
              value: option,
            }))
            return options
          }
          // options from api
          const response = await fetchApi(field.elasticsuite.options.api_rest)
          if (!isFetchError(response)) {
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
          if (!isFetchError(response)) {
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

  return { fieldOptions: map, load }
}
