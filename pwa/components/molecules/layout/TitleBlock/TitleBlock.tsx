import { styled } from '@mui/system'
import { ReactChild } from 'react'

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
  padding: theme.spacing(2),
  borderBottom: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  '&:last-of-type': {
    borderBottom: 'none',
  },
}))

interface IProps {
  title: string
  children: ReactChild
}

function TitleBlock({ title, children }: IProps): JSX.Element {
  return (
    <>
      <CustomTitle>{title}</CustomTitle>
      <Container>{children}</Container>
    </>
  )
}

export default TitleBlock
