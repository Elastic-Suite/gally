import { ReactNode } from 'react'
import { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/system'

import CommonStyledButton from './CommonButtonStyle'

const SecondaryStyledButton = styled(CommonStyledButton)(({ theme }) => ({
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
}))

interface IProps extends ButtonProps {
  children: ReactNode
}

function SecondaryButton(props: IProps) {
  const { children, ...buttonProps } = props

  return (
    <SecondaryStyledButton {...buttonProps} variant="contained">
      {children}
    </SecondaryStyledButton>
  )
}

export default SecondaryButton
