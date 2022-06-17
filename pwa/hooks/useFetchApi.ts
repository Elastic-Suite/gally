import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Fetch } from '~/types'

export function useFetchApi<T>(url: RequestInfo | URL, options: RequestInit = {}): [Fetch<T>, Dispatch<SetStateAction<Fetch<T>>>] {
  const [response, setResponse] = useState<Fetch<T>>({ loading: false })
  const { i18n } = useTranslation('common')

  useEffect(() => {
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Accept-Language': i18n.language,
      },
    })
      .then((response) => response.json())
      .then((json) => setResponse({ data: json, loading: false }))
      .catch((error) => setResponse({ error, loading: false }))
  }, [i18n, options, url])

  return [response, setResponse]
}
