import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { useTranslation } from 'next-i18next'

import { useAppDispatch } from '~/store'
import { IFetch } from '~/types'

export function fetchApi(
  language: string,
  url: RequestInfo | URL,
  options: RequestInit = {}
) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Accept-Language': language,
    },
  }).then((response) => response.json())
}

export function useApiFetch<T>(
  url: RequestInfo | URL,
  options: RequestInit = {}
): [IFetch<T>, Dispatch<SetStateAction<IFetch<T>>>] {
  const [response, setResponse] = useState<IFetch<T>>({ loading: false })
  const { i18n } = useTranslation('common')

  useEffect(() => {
    setResponse({ loading: true })
    fetchApi(i18n.language, url, options)
      .then((json) => setResponse({ data: json, loading: false }))
      .catch((error) => setResponse({ error, loading: false }))
  }, [i18n, options, url])

  return [response, setResponse]
}

export function useApiDispatch<T>(
  action: ActionCreatorWithOptionalPayload<IFetch<T>>,
  url: RequestInfo | URL,
  options: RequestInit = {}
) {
  const dispatch = useAppDispatch()
  const { i18n } = useTranslation('common')

  useEffect(() => {
    dispatch(action({ loading: true }))
    fetchApi(i18n.language, url, options)
      .then((json) => dispatch(action({ data: json, loading: false })))
      .catch((error) => dispatch(action({ error, loading: false })))
  }, [action, dispatch, i18n, options, url])
}
