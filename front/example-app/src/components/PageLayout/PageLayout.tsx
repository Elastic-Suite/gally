import { ReactNode } from 'react'
import { styled } from '@mui/material'

import Title from '../../components/Title/Title'

const Root = styled('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
})

const Content = styled('div')(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(2),
}))

interface IProps {
  children?: ReactNode
  title: string
}

function PageLayout(props: IProps): JSX.Element {
  const { children, title } = props
  return (
    <Root>
      <Title title={title} />
      <Content>{children}</Content>
    </Root>
  )
}

export default PageLayout
