import { ReactChild, useEffect } from 'react'
import { useRouter } from 'next/router'

import { userContext } from '~/contexts'
import { useUser } from '~/hooks'
import { setRequestedPath, useAppDispatch } from '~/store'

interface IProps {
  children: ReactChild
}

function UserProvider(props: IProps): JSX.Element {
  const { children } = props
  const { push, asPath } = useRouter()
  const user = useUser()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!user) {
      dispatch(setRequestedPath(asPath))
      push('/login')
    }
  }, [asPath, dispatch, push, user])

  if (!user) {
    return null
  }

  return <userContext.Provider value={user}>{children}</userContext.Provider>
}

export default UserProvider
