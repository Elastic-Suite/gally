import { Typography, TypographyProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ReactNode } from 'react'

const Root = styled('div')(() => ({
  display: 'flex',
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
  title: string
}

function PageTile(props: IProps): JSX.Element {
  const { children, title, ...typographyProps } = props
  return (
    <Root>
      <CustomTypography {...typographyProps}>{title}</CustomTypography>
      {Boolean(children) && <div>{children}</div>}
    </Root>
  )
}

PageTile.defaultProps = {
  variant: 'h1',
}

export default PageTile
