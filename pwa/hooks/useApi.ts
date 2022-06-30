import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { useTranslation } from 'next-i18next'

import { fetchApi } from '~/services/api'
import { useAppDispatch } from '~/store'
import { IFetch, LoadStatus } from '~/types'

export function useApiFetch<T>(
  url: RequestInfo | URL,
  options?: RequestInit
): [IFetch<T>, Dispatch<SetStateAction<IFetch<T>>>] {
  const [response, setResponse] = useState<IFetch<T>>({
    status: LoadStatus.IDLE,
  })
  const { i18n } = useTranslation('common')

  useEffect(() => {
    setResponse({ status: LoadStatus.LOADING })
    fetchApi(i18n.language, url, options)
      .then((json) => setResponse({ data: json, status: LoadStatus.SUCCEEDED }))
      .catch((error) => setResponse({ error, status: LoadStatus.FAILED }))
  }, [i18n, options, url])

  return [response, setResponse]
}

export function useApiDispatch<T>(
  action: ActionCreatorWithOptionalPayload<IFetch<T>>,
  url: RequestInfo | URL,
  options?: RequestInit
) {
  const dispatch = useAppDispatch()
  const { i18n } = useTranslation('common')

  useEffect(() => {
    dispatch(action({ status: LoadStatus.LOADING }))
    fetchApi(i18n.language, url, options)
      .then((json) =>
        dispatch(action({ data: json, status: LoadStatus.SUCCEEDED }))
      )
      .catch((error) => dispatch(action({ error, status: LoadStatus.FAILED })))
  }, [action, dispatch, i18n, options, url])
}
