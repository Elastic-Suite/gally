import { FunctionComponent, useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isValidUser } from '@elastic-suite/gally-admin-shared'

import { requestedPathContext, userContext } from '../contexts'

export function withAuth<P extends Record<string, unknown>>(
  Cmp: FunctionComponent<P>
): FunctionComponent<P> {
  function WithAuth(props: P): JSX.Element {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { user } = useContext(userContext)
    const { setRequestedPath } = useContext(requestedPathContext)

    useEffect(() => {
      if (!isValidUser(user)) {
        setRequestedPath(pathname)
        navigate('/login')
      }
    }, [navigate, pathname, setRequestedPath, user])

    if (!isValidUser(user)) {
      return null
    }

    return <Cmp {...props} />
  }

  WithAuth.displayName = `WithAuth(${getDisplayName(Cmp)})`
  return WithAuth
}

function getDisplayName<P>(Cmp: FunctionComponent<P>): string {
  return Cmp.displayName || Cmp.name || 'Component'
}
