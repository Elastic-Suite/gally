import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { useTranslation } from 'next-i18next'

import { fetchApi, getListApiParameters } from '~/services'
import { useAppDispatch } from '~/store'
import {
  IFetch,
  IHydraMember,
  IHydraResponse,
  IResource,
  ISearchParameters,
  LoadStatus,
} from '~/types'

export function useApiFetch<T>(
  secure = true
): (
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
) => Promise<T> {
  const { i18n } = useTranslation('common')
  return useCallback(
    (
      resource: IResource | string,
      searchParameters?: ISearchParameters,
      options?: RequestInit
    ) =>
      fetchApi<T>(i18n.language, resource, searchParameters, options, secure),
    [i18n.language, secure]
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
    fetchApi(resource, searchParameters, options)
      .then((json) => setResponse({ data: json, status: LoadStatus.SUCCEEDED }))
      .catch((error) => setResponse({ error, status: LoadStatus.FAILED }))
  }, [fetchApi, options, resource, searchParameters])

  return [response, updateResponse]
}

export function useApiDispatch<T>(
  action: ActionCreatorWithOptionalPayload<IFetch<T>>,
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
): void {
  const fetchApi = useApiFetch<T>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(action({ status: LoadStatus.LOADING }))
    fetchApi(resource, searchParameters, options)
      .then((json) =>
        dispatch(action({ data: json, status: LoadStatus.SUCCEEDED }))
      )
      .catch((error) => dispatch(action({ error, status: LoadStatus.FAILED })))
  }, [action, dispatch, fetchApi, options, resource, searchParameters])
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
