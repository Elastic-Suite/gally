import { useEffect } from 'react'
import { Typography } from '@mui/material'

interface IProps {
  title: string
}

function Title(props: IProps): JSX.Element {
  const { title } = props

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${title} - Gally`
    }
  }, [title])

  return (
    <Typography style={{ textAlign: 'center', margin: '16px 0' }} variant="h4">
      {title}
    </Typography>
  )
}

export default Title
