import { FunctionComponent } from 'react'

import SchemaProvider from '~/components/stateful-providers/SchemaProvider/SchemaProvider'
import UserProvider from '~/components/stateful-providers/UserProvider/UserProvider'

export function withAuth<P extends Record<string, unknown>>(
  Cmp: FunctionComponent<P>
): FunctionComponent<P> {
  function WithAuth(props: P): JSX.Element {
    return (
      <UserProvider>
        <SchemaProvider>
          <Cmp {...props} />
        </SchemaProvider>
      </UserProvider>
    )
  }

  WithAuth.displayName = `WithHoc(${getDisplayName(Cmp)})`
  return WithAuth
}

function getDisplayName<P>(Cmp: FunctionComponent<P>): string {
  return Cmp.displayName || Cmp.name || 'Component'
}
