import { useCallback, useContext, useRef, useState } from 'react'

import { schemaContext } from '~/contexts'
import { useApiFetch } from '~/hooks'
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
  IField,
  IFieldOptions,
  IHydraMember,
  IHydraResponse,
  IOptions,
  IOptionsContext,
  LoadStatus,
} from '~/types'

export function useOptions(): IOptionsContext {
  const api = useContext(schemaContext)
  const fetchApi =
    useApiFetch<IHydraResponse<IHydraMember | IApiSchemaOptions>>()
  const [fieldOptions, setFieldOptions] = useState<IFieldOptions>(new Map())
  const fieldOptionsStatuses = useRef<Map<string, LoadStatus>>(new Map())

  const updateFieldOptions = useCallback(
    (id: string, options: IOptions<string | number>) => {
      fieldOptionsStatuses.current.set(id, LoadStatus.SUCCEEDED)
      setFieldOptions((prevState) => {
        const clone = new Map(prevState)
        clone.set(id, options)
        return clone
      })
    },
    []
  )

  const load = useCallback(
    async (field: IField) => {
      const id = field.property['@id']
      const status = fieldOptionsStatuses.current.get(id)
      if (!status) {
        fieldOptionsStatuses.current.set(id, LoadStatus.LOADING)
        if (hasFieldOptions(field)) {
          // get options from the schema
          if (isDropdownStaticOptions(field.elasticsuite?.options)) {
            // static options
            const options = field.elasticsuite.options.values.map((option) => ({
              label: String(option),
              value: option,
            }))
            updateFieldOptions(id, options)
          } else {
            // options from api
            const response = await fetchApi(field.elasticsuite.options.api_rest)
            if (!isFetchError(response)) {
              updateFieldOptions(
                id,
                getOptionsFromApiSchema(
                  response as IHydraResponse<IApiSchemaOptions>
                )
              )
            } else {
              fieldOptionsStatuses.current.set(id, LoadStatus.FAILED)
            }
          }
        } else if (isReferenceField(field)) {
          // get options by loading all items of the referenced field
          const response = await fetchApi(
            getReferencedResource(api, field)?.url
          )
          if (!isFetchError(response)) {
            updateFieldOptions(
              id,
              getOptionsFromResource(response as IHydraResponse<IHydraMember>)
            )
          } else {
            fieldOptionsStatuses.current.set(id, LoadStatus.FAILED)
          }
        }
      }
    },
    [api, fetchApi, updateFieldOptions]
  )

  return { fieldOptions, load }
}
