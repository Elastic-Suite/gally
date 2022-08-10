import { ReactChild } from 'react'

import { schemaContext } from '~/contexts'
import { useSchemaLoader } from '~/hooks'

interface IProps {
  children: ReactChild
}

function SchemaProvider(props: IProps): JSX.Element {
  const { children } = props
  const api = useSchemaLoader()

  if (api.error) {
    // eslint-disable-next-line no-console
    console.error(api.error)
    return <pre>{JSON.stringify(api.error, null, 2)}</pre>
  } else if (!api.data) {
    return null
  }

  return (
    <schemaContext.Provider value={api.data}>{children}</schemaContext.Provider>
  )
}

export default SchemaProvider
