import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { Resource } from '@api-platform/api-doc-parser'
import { useTranslation } from 'next-i18next'

import { fetchApi } from '~/services'
import { useAppDispatch } from '~/store'
import { IFetch, LoadStatus } from '~/types'

export function useApiFetch<T>(
  resource: Resource | string,
  options?: RequestInit
): [IFetch<T>, Dispatch<SetStateAction<IFetch<T>>>] {
  const [response, setResponse] = useState<IFetch<T>>({
    status: LoadStatus.IDLE,
  })
  const { i18n } = useTranslation('common')

  useEffect(() => {
    setResponse({ status: LoadStatus.LOADING })
    fetchApi<T>(i18n.language, resource, options)
      .then((json) => setResponse({ data: json, status: LoadStatus.SUCCEEDED }))
      .catch((error) => setResponse({ error, status: LoadStatus.FAILED }))
  }, [i18n.language, options, resource])

  return [response, setResponse]
}

export function useApiDispatch<T>(
  action: ActionCreatorWithOptionalPayload<IFetch<T>>,
  resource: Resource | string,
  options?: RequestInit
): void {
  const dispatch = useAppDispatch()
  const { i18n } = useTranslation('common')

  useEffect(() => {
    dispatch(action({ status: LoadStatus.LOADING }))
    fetchApi<T>(i18n.language, resource, options)
      .then((json) =>
        dispatch(action({ data: json, status: LoadStatus.SUCCEEDED }))
      )
      .catch((error) => dispatch(action({ error, status: LoadStatus.FAILED })))
  }, [action, dispatch, i18n.language, options, resource])
}
