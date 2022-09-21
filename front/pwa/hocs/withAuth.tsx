import { FunctionComponent, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { userContext } from '~/contexts'
import { setRequestedPath, useAppDispatch } from '~/store'
import { isValidUser } from 'shared'

import OptionsProvider from '~/components/stateful-providers/OptionsProvider/OptionsProvider'

export function withAuth<P extends Record<string, unknown>>(
  Cmp: FunctionComponent<P>
): FunctionComponent<P> {
  function WithAuth(props: P): JSX.Element {
    const { push, asPath } = useRouter()
    const user = useContext(userContext)
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

    return (
      <OptionsProvider>
        <Cmp {...props} />
      </OptionsProvider>
    )
  }

  WithAuth.displayName = `WithHoc(${getDisplayName(Cmp)})`
  return WithAuth
}

function getDisplayName<P>(Cmp: FunctionComponent<P>): string {
  return Cmp.displayName || Cmp.name || 'Component'
}
