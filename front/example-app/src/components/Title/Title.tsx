import { useEffect } from 'react'
import { Typography } from '@mui/material'

interface IProps {
  children: string
}

function Title(props: IProps): JSX.Element {
  const { children } = props

  useEffect(() => {
    if (typeof document !== 'undefined' && typeof children === 'string') {
      document.title = children
    }
  }, [children])

  return <Typography variant="h1">{children}</Typography>
}

export default Title
