import { ReactNode } from 'react'
import { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/system'

import CommonStyledButton from '~/components/atoms/buttons/CommonButtonStyle'

const TertiaryStyledButton = styled(CommonStyledButton)(({ theme }) => ({
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
}))

interface IProps extends ButtonProps {
  children: ReactNode
}

function TertiaryButton(props: IProps): JSX.Element {
  const { children, ...buttonProps } = props

  return (
    <TertiaryStyledButton {...buttonProps} variant="contained">
      {children}
    </TertiaryStyledButton>
  )
}

export default TertiaryButton
