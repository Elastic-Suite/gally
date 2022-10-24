import { ReactNode } from 'react'

import { optionsContext } from '~/contexts'
import { useOptions } from '~/hooks'

interface IProps {
  children: ReactNode
}

function OptionsProvider(props: IProps): JSX.Element {
  const { children } = props
  const context = useOptions()
  return (
    <optionsContext.Provider value={context}>
      {children}
    </optionsContext.Provider>
  )
}

export default OptionsProvider
