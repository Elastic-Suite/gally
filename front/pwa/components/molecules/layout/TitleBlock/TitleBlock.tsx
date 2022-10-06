import { Box, BoxProps } from '@mui/material'
import { styled } from '@mui/system'
import { CSSProperties, FunctionComponent, ReactNode } from 'react'

import { getCustomScrollBarStyles } from 'shared'

interface ICustomTitleProps extends BoxProps {
  line?: boolean
}
const customTitleProps = ['line']

const CustomTitle = styled(Box as FunctionComponent<ICustomTitleProps>, {
  shouldForwardProp: (prop: string) => !customTitleProps.includes(prop),
})(({ theme, line }) => ({
  color: theme.palette.colors.neutral[900],
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Inter',
  padding: theme.spacing(2),
  paddingBottom: line ? theme.spacing(0) : theme.spacing(2),
  borderBottom: line ? 'none' : '1px solid',
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

const ContainerPadding = styled('div')(({ theme }) => ({
  borderBottom: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  '&:last-of-type': {
    borderBottom: 'none',
  },
  overflow: 'auto',
  paddingBottom: theme.spacing(2),
  ...getCustomScrollBarStyles(theme),
}))

const PaddingBox = styled('div')(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(2),
}))

interface IProps {
  title: string
  children?: ReactNode
  line?: boolean
  style?: CSSProperties
}

function TitleBlock({
  title,
  children,
  line = true,
  style,
}: IProps): JSX.Element {
  const isChildren = Boolean(children)
  return (
    <>
      <CustomTitle line={!line} style={style}>
        {title}
      </CustomTitle>
      {isChildren ? (
        <Container>
          <PaddingBox>{children}</PaddingBox>
        </Container>
      ) : (
        <ContainerPadding />
      )}
    </>
  )
}

export default TitleBlock
