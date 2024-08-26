import { ReactNode } from 'react'
import { styled } from '@mui/material'

import PageTitle from '../../components/PageTitle/PageTitle'

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
    (
      <Root>
        <PageTitle title={title} />
        <Content>{children}</Content>
      </Root>
    )
  )
}

export default PageLayout
