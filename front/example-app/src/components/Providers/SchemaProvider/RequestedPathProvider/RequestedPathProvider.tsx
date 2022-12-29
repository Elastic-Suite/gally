import { ReactNode, useMemo, useState } from 'react'

import { requestedPathContext } from '../../../../contexts'

interface IProps {
  children: ReactNode
}

function RequestedPathProvider(props: IProps): JSX.Element {
  const { children } = props
  const [requestedPath, setRequestedPath] = useState<string>('/')

  const context = useMemo(
    () => ({
      requestedPath,
      setRequestedPath,
    }),
    [requestedPath]
  )

  return (
    <requestedPathContext.Provider value={context}>
      {children}
    </requestedPathContext.Provider>
  )
}

export default RequestedPathProvider
