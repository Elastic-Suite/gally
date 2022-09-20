import { ReactNode } from 'react'

import { userContext } from '~/contexts'
import { useUser } from '~/hooks'

interface IProps {
  children: ReactNode
}

function UserProvider(props: IProps): JSX.Element {
  const { children } = props
  const user = useUser()
  return <userContext.Provider value={user}>{children}</userContext.Provider>
}

export default UserProvider
