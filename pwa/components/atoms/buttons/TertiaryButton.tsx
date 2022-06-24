import { ReactChild } from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

import useCommonButtonStyle from '~/components/atoms/buttons/CommonButtonStyle'

const useTertiaryButtonStyle = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.colors.neutral['900'],
    background: 'none',
    boxShadow: 'none',
    '&::before': {
      background: theme.palette.colors.neutral['200'],
      boxShadow: 'none',
    },
    '&:hover': {
      background: 'none',
      boxShadow: 'none',
    },
    '&& .MuiTouchRipple-child': {
      backgroundColor: theme.palette.colors.neutral['300'],
    },
  },
}))

interface IProps extends ButtonProps {
  children: ReactChild
}

function TertiaryButton(props: IProps) {
  const { children, ...buttonProps } = props

  const CommonButtonStyle = useCommonButtonStyle()
  const tertiaryButtonStyle = useTertiaryButtonStyle()

  return (
    <Button
      {...buttonProps}
      className={CommonButtonStyle.root + ' ' + tertiaryButtonStyle.root}
      variant="contained"
    >
      {children}
    </Button>
  )
}

export default TertiaryButton
