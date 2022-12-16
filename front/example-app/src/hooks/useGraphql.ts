import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import debounce from 'lodash.debounce'
import { IFetch, IGraphqlApi, LoadStatus, fetchGraphql, isError } from 'shared'

import { catalogContext } from '../contexts'

import { useLog } from './useLog'

export type ILoadResource = (
  query: string,
  variables?: Record<string, unknown>,
  options?: RequestInit
) => void

const debounceDelay = 500

export function useApiGraphql(): IGraphqlApi {
  const { localizedCatalog } = useContext(catalogContext)
  const log = useLog()
  const locale = localizedCatalog?.locale ?? 'en'
  return useCallback(
    async <T>(
      query: string,
      variables?: Record<string, unknown>,
      options?: RequestInit
    ) => {
      try {
        const json = await fetchGraphql<T>(
          locale,
          query,
          variables,
          options,
          false
        )
        return json
      } catch (error) {
        log(error)
        return { error }
      }
    },
    [locale, log]
  )
}

export function useGraphqlApi<T>(): [
  IFetch<T>,
  Dispatch<SetStateAction<T>>,
  ILoadResource,
  ILoadResource
] {
  const graphqlApi = useApiGraphql()
  const [response, setResponse] = useState<IFetch<T>>({
    status: LoadStatus.IDLE,
  })

  const updateResponse = useCallback((data: SetStateAction<T>): void => {
    setResponse((prevState) => ({
      ...prevState,
      data: data instanceof Function ? data(prevState.data) : data,
    }))
  }, [])

  const load = useCallback(
    (
      query: string,
      variables?: Record<string, unknown>,
      options?: RequestInit
    ) => {
      setResponse((prevState) => ({
        data: prevState.data,
        status: LoadStatus.LOADING,
      }))
      return graphqlApi<T>(query, variables, options).then((json) => {
        if (isError(json)) {
          setResponse({ error: json.error, status: LoadStatus.FAILED })
        } else {
          setResponse({ data: json, status: LoadStatus.SUCCEEDED })
        }
      })
    },
    [graphqlApi]
  )

  const debouncedLoad = useMemo(() => debounce(load, debounceDelay), [load])

  return [response, updateResponse, load, debouncedLoad]
}
