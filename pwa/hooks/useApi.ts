import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { useTranslation } from 'next-i18next'

import { fetchApi, getListApiParameters } from '~/services'
import { useAppDispatch } from '~/store'
import { IFetch, IResource, ISearchParameters, LoadStatus } from '~/types'

export function useApiFetch<T>(): (
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
) => Promise<T> {
  const { i18n } = useTranslation('common')
  return useMemo(() => fetchApi.bind(null, i18n.language), [i18n.language])
}

export function useFetchApi<T>(
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
): [IFetch<T>, Dispatch<SetStateAction<IFetch<T>>>] {
  const fetchApi = useApiFetch<T>()
  const [response, setResponse] = useState<IFetch<T>>({
    status: LoadStatus.IDLE,
  })

  useEffect(() => {
    setResponse((prevState) => ({
      data: prevState.data,
      status: LoadStatus.LOADING,
    }))
    fetchApi(resource, searchParameters, options)
      .then((json) => setResponse({ data: json, status: LoadStatus.SUCCEEDED }))
      .catch((error) => setResponse({ error, status: LoadStatus.FAILED }))
  }, [fetchApi, options, resource, searchParameters])

  return [response, setResponse]
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

export function useApiList<T>(
  resource: IResource | string,
  page: number | false = 0,
  searchParameters?: ISearchParameters,
  searchValue?: string
): [IFetch<T>, Dispatch<SetStateAction<IFetch<T>>>] {
  const parameters = useMemo(
    () => getListApiParameters(page, searchParameters, searchValue),
    [page, searchParameters, searchValue]
  )
  return useFetchApi<T>(resource, parameters)
}
