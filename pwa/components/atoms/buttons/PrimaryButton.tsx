import { ReactNode } from 'react'
import { ButtonProps } from '@mui/material/Button'

import CommonStyledButton from '~/components/atoms/buttons/CommonButtonStyle'

interface IProps extends ButtonProps {
  children: ReactNode
}

function PrimaryButton(props: IProps) {
  const { children, ...buttonProps } = props

  return (
    <CommonStyledButton {...buttonProps} variant="contained">
      {children}
    </CommonStyledButton>
  )
}

export default PrimaryButton
