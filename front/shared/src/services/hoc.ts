import { FunctionComponent } from 'react'

export function getDisplayName<P>(Cmp: FunctionComponent<P>): string {
  return Cmp.displayName || Cmp.name || 'Component'
}
