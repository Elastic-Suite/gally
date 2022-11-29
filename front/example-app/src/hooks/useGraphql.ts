import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import debounce from 'lodash.debounce'
import {
  IFetch,
  IGraphqlApi,
  ILoadResource,
  LoadStatus,
  fetchGraphql,
  isError,
} from 'shared'

import { catalogContext } from '../contexts'

import { useLog } from './useLog'

const debounceDelay = 500

export function useApiGraphql<T>(): IGraphqlApi<T> {
  const { localizedCatalog } = useContext(catalogContext)
  const log = useLog()
  const locale = localizedCatalog?.locale ?? 'en'
  return useCallback(
    async (
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

export function useGraphqlApi<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: RequestInit
): [IFetch<T>, Dispatch<SetStateAction<T>>, ILoadResource, ILoadResource] {
  const graphqlApi = useApiGraphql<T>()
  const [response, setResponse] = useState<IFetch<T>>({
    status: LoadStatus.IDLE,
  })

  const updateResponse = useCallback((data: SetStateAction<T>): void => {
    setResponse((prevState) => ({
      ...prevState,
      data: data instanceof Function ? data(prevState.data) : data,
    }))
  }, [])

  const load = useCallback(() => {
    setResponse((prevState) => ({
      data: prevState.data,
      status: LoadStatus.LOADING,
    }))
    return graphqlApi(query, variables, options).then((json) => {
      if (isError(json)) {
        setResponse({ error: json.error, status: LoadStatus.FAILED })
      } else {
        setResponse({ data: json, status: LoadStatus.SUCCEEDED })
      }
    })
  }, [graphqlApi, options, query, variables])

  const debouncedLoad = useMemo(() => debounce(load, debounceDelay), [load])

  return [response, updateResponse, load, debouncedLoad]
}
