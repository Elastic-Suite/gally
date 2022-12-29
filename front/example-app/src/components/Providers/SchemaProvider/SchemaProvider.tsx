import { ReactNode } from 'react'
import { schemaContext, useSchemaLoader } from 'gally-admin-shared'

interface IProps {
  children: ReactNode
}

function SchemaProvider(props: IProps): JSX.Element {
  const { children } = props
  const api = useSchemaLoader()

  if (!api.data) {
    return null
  }

  return (
    <schemaContext.Provider value={api.data}>{children}</schemaContext.Provider>
  )
}

export default SchemaProvider
