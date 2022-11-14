import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'next-i18next'

import {
  IFetch,
  IGraphqlApi,
  ILoadResource,
  LoadStatus,
  fetchGraphql,
  isError,
} from 'shared'

import { useLog } from './useLog'

export function useApiGraphql<T>(secure = true): IGraphqlApi<T> {
  const { i18n } = useTranslation('common')
  const log = useLog()
  return useCallback(
    async (
      query: string,
      variables?: Record<string, unknown>,
      options?: RequestInit
    ) => {
      try {
        const json = await fetchGraphql<T>(
          i18n.language,
          query,
          variables,
          options,
          secure
        )
        return json
      } catch (error) {
        log(error)
        return { error }
      }
    },
    [i18n.language, log, secure]
  )
}

export function useGraphqlApi<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: RequestInit
): [IFetch<T>, Dispatch<SetStateAction<T>>, ILoadResource] {
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
    graphqlApi(query, variables, options).then((json) => {
      if (isError(json)) {
        setResponse({ error: json.error, status: LoadStatus.FAILED })
      } else {
        setResponse({ data: json, status: LoadStatus.SUCCEEDED })
      }
    })
  }, [graphqlApi, options, query, variables])

  useEffect(() => {
    load()
  }, [load])

  return [response, updateResponse, load]
}
