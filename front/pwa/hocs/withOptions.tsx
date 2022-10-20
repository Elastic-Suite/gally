import { FunctionComponent } from 'react'
import { getDisplayName } from 'shared'

import OptionsProvider from '~/components/stateful-providers/OptionsProvider/OptionsProvider'

export function withOptions<P extends Record<string, unknown>>(
  Cmp: FunctionComponent<P>
): FunctionComponent<P> {
  function WithOptions(props: P): JSX.Element {
    return (
      <OptionsProvider>
        <Cmp {...props} />
      </OptionsProvider>
    )
  }

  WithOptions.displayName = `WithOptions(${getDisplayName(Cmp)})`
  return WithOptions
}
