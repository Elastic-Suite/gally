import { useEffect } from 'react'
import { Typography } from '@mui/material'

interface IProps {
  title: string
}

function Title(props: IProps): JSX.Element {
  const { title } = props

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = title
    }
  }, [title])

  return <Typography variant="h1">{title}</Typography>
}

export default Title
