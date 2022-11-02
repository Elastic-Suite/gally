import { ReactNode } from 'react'
import { styled } from '@mui/material'

const Root = styled('div')({
  display: 'flex',
  flex: 1,
})

const Left = styled('div')(({ theme }) => ({
  flex: 1,
  marginRight: theme.spacing(2),
}))

const Right = styled('div')({
  flex: 3,
})

interface IProps {
  children: ReactNode
  left?: ReactNode
}
function TwoColsLayout(props: IProps): JSX.Element {
  const { children, left } = props
  return (
    <Root>
      {Boolean(left) && <Left>{left}</Left>}
      <Right>{children}</Right>
    </Root>
  )
}

export default TwoColsLayout
