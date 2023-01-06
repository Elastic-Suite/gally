import { FunctionComponent, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getDisplayName, isValidUser } from 'gally-admin-shared'

import {
  selectUser,
  setRequestedPath,
  useAppDispatch,
  useAppSelector,
} from '~/store'

export function withAuth<P extends Record<string, unknown>>(
  Cmp: FunctionComponent<P>
): FunctionComponent<P> {
  function WithAuth(props: P): JSX.Element {
    const { push, asPath } = useRouter()
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()

    useEffect(() => {
      if (!isValidUser(user)) {
        dispatch(setRequestedPath(asPath))
        push('/login')
      }
    }, [asPath, dispatch, push, user])

    if (!isValidUser(user)) {
      return null
    }

    return <Cmp {...props} />
  }

  WithAuth.displayName = `WithAuth(${getDisplayName(Cmp)})`
  return WithAuth
}
