import { ReactChild } from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

import useCommonButtonStyle from '~/components/atoms/buttons/CommonButtonStyle'

const useSecondaryButtonStyle = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.colors.secondary['600'],
    background: theme.palette.colors.secondary['100'],
    boxShadow: theme.palette.colors.shadow.secondaryButton.sm,
    '&::before': {
      background: theme.palette.colors.secondary['200'],
      boxShadow: theme.palette.colors.shadow.secondaryButton.md,
    },
    '&:hover': {
      background: theme.palette.colors.secondary['100'],
      boxShadow: theme.palette.colors.shadow.secondaryButton.sm,
    },
    '&& .MuiTouchRipple-child': {
      backgroundColor: theme.palette.colors.secondary['300'],
    },
  },
}))

interface IProps extends ButtonProps {
  children: ReactChild
}

function SecondaryButton(props: IProps) {
  const { children, ...buttonProps } = props

  const CommonButtonStyle = useCommonButtonStyle()
  const secondaryButtonStyle = useSecondaryButtonStyle()

  return (
    <Button
      {...buttonProps}
      className={CommonButtonStyle.root + ' ' + secondaryButtonStyle.root}
      variant="contained"
    >
      {children}
    </Button>
  )
}

export default SecondaryButton
