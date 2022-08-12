import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'next-i18next'

import { fetchApi, getListApiParameters, isFetchError } from '~/services'
import {
  IFetch,
  IFetchError,
  IHydraMember,
  IHydraResponse,
  IResource,
  ISearchParameters,
  LoadStatus,
} from '~/types'

import { useLog } from './useLog'

export function useApiFetch<T>(
  secure = true
): (
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
) => Promise<T | IFetchError> {
  const { i18n } = useTranslation('common')
  const log = useLog()
  return useCallback(
    async (
      resource: IResource | string,
      searchParameters?: ISearchParameters,
      options?: RequestInit
    ) => {
      try {
        const json = await fetchApi<T>(
          i18n.language,
          resource,
          searchParameters,
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

export function useFetchApi<T>(
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
): [IFetch<T>, Dispatch<SetStateAction<T>>] {
  const fetchApi = useApiFetch<T>()
  const [response, setResponse] = useState<IFetch<T>>({
    status: LoadStatus.IDLE,
  })

  function updateResponse(data: SetStateAction<T>): void {
    setResponse((prevState) => ({
      ...prevState,
      data: data instanceof Function ? data(prevState.data) : data,
    }))
  }

  useEffect(() => {
    setResponse((prevState) => ({
      data: prevState.data,
      status: LoadStatus.LOADING,
    }))
    fetchApi(resource, searchParameters, options).then((json) => {
      if (isFetchError(json)) {
        setResponse({ error: json.error, status: LoadStatus.FAILED })
      } else {
        setResponse({ data: json, status: LoadStatus.SUCCEEDED })
      }
    })
  }, [fetchApi, options, resource, searchParameters])

  return [response, updateResponse]
}

export function useApiList<T extends IHydraMember>(
  resource: IResource | string,
  page: number | false = 0,
  searchParameters?: ISearchParameters,
  searchValue?: string
): [IFetch<IHydraResponse<T>>, Dispatch<SetStateAction<T[]>>] {
  const parameters = useMemo(
    () => getListApiParameters(page, searchParameters, searchValue),
    [page, searchParameters, searchValue]
  )
  const [response, updateResponse] = useFetchApi<IHydraResponse<T>>(
    resource,
    parameters
  )

  function updateList(data: SetStateAction<T[]>): void {
    updateResponse((prevState) => ({
      ...prevState,
      'hydra:member':
        data instanceof Function ? data(prevState['hydra:member']) : data,
    }))
  }

  return [response, updateList]
}
