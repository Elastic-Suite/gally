import { ReactNode } from 'react'

import { IApi, schemaContext } from 'shared'

interface IProps {
  api: IApi
  children: ReactNode
}

function TestProvider(props: IProps): JSX.Element {
  const { api, children } = props
  return <schemaContext.Provider value={api}>{children}</schemaContext.Provider>
}

export default TestProvider
