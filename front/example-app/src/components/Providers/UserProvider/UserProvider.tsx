import { ReactNode, useMemo } from 'react'

import { userContext } from '../../../contexts'
import { useUser } from '../../../hooks'

interface IProps {
  children: ReactNode
}

function UserProvider(props: IProps): JSX.Element {
  const { children } = props
  const [user, setToken] = useUser()
  const context = useMemo(
    () => ({
      user,
      setToken,
    }),
    [user, setToken]
  )

  return <userContext.Provider value={context}>{children}</userContext.Provider>
}

export default UserProvider
