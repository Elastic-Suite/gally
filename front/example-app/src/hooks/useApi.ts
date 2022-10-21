import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  IFetch,
  IFetchApi,
  IHydraMember,
  IHydraResponse,
  ILoadResource,
  IResource,
  ISearchParameters,
  LoadStatus,
  defaultPageSize,
  fetchApi,
  getListApiParameters,
  isError,
} from 'shared'

export function useApiFetch(secure = true): IFetchApi {
  return useCallback<IFetchApi>(
    async <T>(
      resource: IResource | string,
      searchParameters?: ISearchParameters,
      options?: RequestInit
    ) => {
      try {
        const json = await fetchApi<T>(
          'en',
          resource,
          searchParameters,
          options,
          secure
        )
        return json
      } catch (error) {
        return { error }
      }
    },
    [secure]
  )
}

export function useFetchApi<T>(
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
): [IFetch<T>, Dispatch<SetStateAction<T>>, ILoadResource] {
  const fetchApi = useApiFetch()
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
    fetchApi<T>(resource, searchParameters, options).then((json) => {
      if (isError(json)) {
        setResponse({ error: json.error, status: LoadStatus.FAILED })
      } else {
        setResponse({ data: json, status: LoadStatus.SUCCEEDED })
      }
    })
  }, [fetchApi, options, resource, searchParameters])

  useEffect(() => {
    load()
  }, [load])

  return [response, updateResponse, load]
}

export function useApiList<T extends IHydraMember>(
  resource: IResource | string,
  page: number | false = 0,
  rowsPerPage: number = defaultPageSize,
  searchParameters?: ISearchParameters,
  searchValue?: string
): [IFetch<IHydraResponse<T>>, Dispatch<SetStateAction<T[]>>, ILoadResource] {
  const parameters = useMemo(
    () =>
      getListApiParameters(page, rowsPerPage, searchParameters, searchValue),
    [page, rowsPerPage, searchParameters, searchValue]
  )
  const [response, updateResponse, load] = useFetchApi<IHydraResponse<T>>(
    resource,
    parameters
  )

  const updateList = useCallback(
    (data: SetStateAction<T[]>): void => {
      updateResponse((prevState) => ({
        ...prevState,
        'hydra:member':
          data instanceof Function ? data(prevState['hydra:member']) : data,
      }))
    },
    [updateResponse]
  )

  return [response, updateList, load]
}
