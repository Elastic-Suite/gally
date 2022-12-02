import { useEffect } from 'react'
import { getUser, storageGet, tokenStorageKey } from 'shared'

import { selectToken, setUser, useAppDispatch, useAppSelector } from '~/store'

import { useLog } from './useLog'

export function useUser(): void {
  const dispatch = useAppDispatch()
  const log = useLog()
  const token = storageGet(tokenStorageKey)
  const stateToken = useAppSelector(selectToken)

  useEffect(() => {
    try {
      if (token && token !== stateToken) {
        const user = getUser(token)
        dispatch(setUser({ token, user }))
      }
    } catch (error) {
      log(error)
      if (stateToken !== '') {
        dispatch(setUser({ token: '', user: null }))
      }
    }
  }, [dispatch, log, stateToken, token])
}
