import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { useTranslation } from 'next-i18next'

import { fetchApi, getListApiParameters } from '~/services'
import { useAppDispatch } from '~/store'
import { IFetch, IResource, ISearchParameters, LoadStatus } from '~/types'

export function useApiFetch<T>(
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
): [IFetch<T>, Dispatch<SetStateAction<IFetch<T>>>] {
  const [response, setResponse] = useState<IFetch<T>>({
    status: LoadStatus.IDLE,
  })
  const { i18n } = useTranslation('common')

  useEffect(() => {
    setResponse((prevState) => ({
      data: prevState.data,
      status: LoadStatus.LOADING,
    }))
    fetchApi<T>(i18n.language, resource, searchParameters, options)
      .then((json) => setResponse({ data: json, status: LoadStatus.SUCCEEDED }))
      .catch((error) => setResponse({ error, status: LoadStatus.FAILED }))
  }, [i18n.language, options, resource, searchParameters])

  return [response, setResponse]
}

export function useApiDispatch<T>(
  action: ActionCreatorWithOptionalPayload<IFetch<T>>,
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
): void {
  const dispatch = useAppDispatch()
  const { i18n } = useTranslation('common')

  useEffect(() => {
    dispatch(action({ status: LoadStatus.LOADING }))
    fetchApi<T>(i18n.language, resource, searchParameters, options)
      .then((json) =>
        dispatch(action({ data: json, status: LoadStatus.SUCCEEDED }))
      )
      .catch((error) => dispatch(action({ error, status: LoadStatus.FAILED })))
  }, [action, dispatch, i18n.language, options, resource, searchParameters])
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
  return useApiFetch<T>(resource, parameters)
}
