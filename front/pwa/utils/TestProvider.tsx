import { ReactNode } from 'react'

import { userContext } from '~/contexts'
import { IApi, IUser, schemaContext } from 'shared'

import OptionsProvider from '~/components/stateful-providers/OptionsProvider/OptionsProvider'

interface IProps {
  api: IApi
  children: ReactNode
}

const timestamp = Math.floor(Date.now() / 1000)
const expires = 8 * 60 * 60 // 8 hours

const user = {
  iat: timestamp,
  exp: timestamp + expires,
  roles: ['ROLE_ADMIN', 'ROLE_CONTRIBUTOR'],
  username: 'admin@example.com',
} as IUser

function TestProvider(props: IProps): JSX.Element {
  const { api, children } = props
  return (
    <userContext.Provider value={user}>
      <schemaContext.Provider value={api}>
        <OptionsProvider>{children}</OptionsProvider>
      </schemaContext.Provider>
    </userContext.Provider>
  )
}

export default TestProvider
