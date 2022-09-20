import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'

import { breadcrumbContext } from '~/contexts'

interface IProps {
  children: ReactNode
}

function BreadcrumbProvider(props: IProps): JSX.Element {
  const { children } = props
  const [breadcrumb, setBreadcrumb] = useState([])
  const breadcrumbContextValue: [string[], Dispatch<SetStateAction<string[]>>] =
    useMemo(() => [breadcrumb, setBreadcrumb], [breadcrumb])

  return (
    <breadcrumbContext.Provider value={breadcrumbContextValue}>
      {children}
    </breadcrumbContext.Provider>
  )
}

export default BreadcrumbProvider
