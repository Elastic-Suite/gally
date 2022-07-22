import { ReactNode, useEffect } from 'react'

import { fetchDoc, selectDoc, useAppDispatch, useAppSelector } from '~/store'
import { LoadStatus } from '~/types'

interface IProps {
  children: ReactNode
}

function DocsLoader(props: IProps): JSX.Element {
  const { children } = props
  const dispatch = useAppDispatch()
  const doc = useAppSelector(selectDoc)

  useEffect(() => {
    if (doc.status === LoadStatus.IDLE) {
      dispatch(fetchDoc())
    }
  }, [dispatch, doc.status])

  if (doc.error) {
    return <>{doc.error.toString()}</>
  } else if (!doc.data) {
    return null
  }

  return <>{children}</>
}

export default DocsLoader
