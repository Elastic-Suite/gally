import { Box, Fade } from '@mui/material'

interface IProps {
  val?: boolean
  children?: JSX.Element | JSX.Element[] | string
}

function VirtualRule({ val, children }: IProps): JSX.Element {
  return (
    <Fade in={val}>
      <Box>{children}</Box>
    </Fade>
  )
}

export default VirtualRule
