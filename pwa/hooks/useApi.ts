import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { Resource } from '@api-platform/api-doc-parser'
import { useTranslation } from 'next-i18next'

import { fetchApi, removeEmptyParameters } from '~/services'
import { useAppDispatch } from '~/store'
import { IFetch, ISearchParameters, LoadStatus } from '~/types'
import {
  currentPage,
  defaultPageSize,
  pageSize,
  usePagination,
} from '~/constants'

export function useApiFetch<T>(
  resource: Resource | string,
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
  resource: Resource | string,
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
  resource: Resource | string,
  page: number | false = 0,
  searchParameters?: ISearchParameters
): [IFetch<T>, Dispatch<SetStateAction<IFetch<T>>>] {
  const parameters = useMemo(() => {
    if (typeof page === 'number') {
      return removeEmptyParameters({
        [usePagination]: true,
        [pageSize]: defaultPageSize,
        [currentPage]: page + 1,
        ...searchParameters,
      })
    }
    return removeEmptyParameters({
      [usePagination]: false,
      ...searchParameters,
    })
  }, [searchParameters, page])
  return useApiFetch<T>(resource, parameters)
}
