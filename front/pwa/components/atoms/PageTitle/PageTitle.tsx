import { Typography, TypographyProps } from '@mui/material'
import { styled } from '@mui/system'
import Head from 'next/head'
import { ReactNode } from 'react'
import { getHeadTitle } from '~/../shared'

const Root = styled('div')(() => ({
  display: 'flex',
}))

const StickyRoot = styled(Root)(({ theme }) => ({
  position: 'sticky',
  top: '84px',
  backgroundColor: theme.palette.background.page,
  zIndex: 2,
  margin: '-10px 0',
  padding: '10px 0',
}))

const CustomTypography = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: '48px',
  flex: '1',
  color: theme.palette.colors.neutral['900'],

  '&:after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    width: '56px',
    height: '4px',
    left: '0',
    bottom: '-12px',
    background: theme.palette.primary.main,
    borderRadius: '2px',
  },
}))

interface IProps extends TypographyProps {
  children?: ReactNode
  sticky?: boolean
  title: string
}

function PageTitle(props: IProps): JSX.Element {
  const { children, sticky, title, ...typographyProps } = props
  const RootComponent = sticky ? StickyRoot : Root

  return (
    <>
      <Head>
        <title>{getHeadTitle(title)}</title>
      </Head>
      <RootComponent>
        {title ? (
          <CustomTypography {...typographyProps}>{title}</CustomTypography>
        ) : null}
        {Boolean(children) && <div>{children}</div>}
      </RootComponent>
    </>
  )
}

PageTitle.defaultProps = {
  variant: 'h1',
}

export default PageTitle
