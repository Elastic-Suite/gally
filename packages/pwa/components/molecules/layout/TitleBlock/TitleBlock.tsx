import { styled } from '@mui/system'
import { ReactNode } from 'react'

import { getCustomScrollBarStyles } from 'shared'

const CustomTitle = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Inter',
  padding: theme.spacing(2),
  borderBottom: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
}))

const Container = styled('div')(({ theme }) => ({
  borderBottom: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  '&:last-of-type': {
    borderBottom: 'none',
  },
  overflow: 'auto',
  ...getCustomScrollBarStyles(theme),
}))

const PaddingBox = styled('div')(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(2),
}))

interface IProps {
  title: string
  children: ReactNode
}

function TitleBlock({ title, children }: IProps): JSX.Element {
  return (
    <>
      <CustomTitle>{title}</CustomTitle>
      <Container>
        <PaddingBox>{children}</PaddingBox>
      </Container>
    </>
  )
}

export default TitleBlock
