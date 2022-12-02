import { ReactNode } from 'react'

import OptionsProvider from '~/components/stateful-providers/OptionsProvider/OptionsProvider'

interface IProps {
  children: ReactNode
}

function TestProvider(props: IProps): JSX.Element {
  const { children } = props
  return <OptionsProvider>{children}</OptionsProvider>
}

export default TestProvider
