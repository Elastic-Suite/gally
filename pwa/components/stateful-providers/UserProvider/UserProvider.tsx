import { ReactChild } from 'react'
import { useRouter } from 'next/router'

import { userContext } from '~/contexts'
import { useUser } from '~/hooks'

interface IProps {
  children: ReactChild
}

function UserProvider(props: IProps): JSX.Element {
  const { children } = props
  const router = useRouter()
  const user = useUser()

  if (!user) {
    router.push('/login')
  }

  return <userContext.Provider value={user}>{children}</userContext.Provider>
}

export default UserProvider
