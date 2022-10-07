import { styled } from '@mui/system'
import { CSSProperties, ReactNode } from 'react'

import { getCustomScrollBarStyles } from 'shared'

const CustomTitleNoBorder = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Inter',
  padding: theme.spacing(2),
  paddingBottom: 0,
}))

const CustomTitleBorder = styled(CustomTitleNoBorder)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  borderBottom: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
}))

const CustomSousTitleNoBorder = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[600],
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '18px',
  fontFamily: 'Inter',
  padding: theme.spacing(2),
  paddingBottom: 0,
}))

const CustomSousTitleBorder = styled(CustomSousTitleNoBorder)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
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
  children?: ReactNode
  style?: CSSProperties
  borderBottom?: boolean
  sousTitle?: boolean
}

function TitleBlock(props: IProps): JSX.Element {
  const { title, children, style, borderBottom = true, sousTitle } = props
  const CustomTitle = borderBottom
    ? sousTitle
      ? CustomSousTitleBorder
      : CustomTitleBorder
    : sousTitle
    ? CustomSousTitleNoBorder
    : CustomTitleNoBorder
  return (
    <>
      <CustomTitle style={style}>{title}</CustomTitle>
      {children ? <Container>
          <PaddingBox>{children}</PaddingBox>
        </Container> : null}
    </>
  )
}

export default TitleBlock
