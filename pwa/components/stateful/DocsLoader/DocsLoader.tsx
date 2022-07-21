import { ReactNode, useEffect } from 'react'

import { fetchDocs, selectDocs, useAppDispatch, useAppSelector } from '~/store'
import { LoadStatus } from '~/types'

interface IProps {
  children: ReactNode
}

function DocsLoader(props: IProps): JSX.Element {
  const { children } = props
  const dispatch = useAppDispatch()
  const docs = useAppSelector(selectDocs)

  useEffect(() => {
    if (docs.status === LoadStatus.IDLE) {
      dispatch(fetchDocs())
    }
  }, [dispatch, docs.status])

  if (docs.error) {
    return <>{docs.error.toString()}</>
  } else if (!docs.data.json && !docs.data.jsonld) {
    return null
  }

  return <>{children}</>
}

export default DocsLoader
