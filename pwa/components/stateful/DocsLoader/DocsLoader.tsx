import { ReactNode, useEffect, useState } from 'react'
import { Api, parseHydraDocumentation } from '@api-platform/api-doc-parser'

import { resourcesContext } from '~/contexts'
import { getApiUrl } from '~/services'
import { IFetch, LoadStatus } from '~/types'

interface IProps {
  children: ReactNode
}

function DocsLoader(props: IProps): JSX.Element {
  const { children } = props
  const [api, setApi] = useState<IFetch<Api>>({
    status: LoadStatus.IDLE,
  })

  useEffect(() => {
    if (api.status === LoadStatus.IDLE) {
      setApi({ status: LoadStatus.LOADING })
      parseHydraDocumentation(getApiUrl())
        .then(({ api }) => setApi({ status: LoadStatus.SUCCEEDED, data: api }))
        .catch((error) => setApi({ error, status: LoadStatus.FAILED }))
    }
  }, [api.status])

  if (api.error) {
    return <>{api.error.toString()}</>
  } else if (!api.data) {
    return null
  }

  return (
    <resourcesContext.Provider value={api.data}>
      {children}
    </resourcesContext.Provider>
  )
}

export default DocsLoader
