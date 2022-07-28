import { ReactNode } from 'react'
import { ButtonProps } from '@mui/material'

import CommonStyledButton from '~/components/atoms/buttons/CommonButtonStyle'

interface IProps extends ButtonProps {
  children: ReactNode
}

function PrimaryButton(props: IProps): JSX.Element {
  const { children, ...buttonProps } = props

  return (
    <CommonStyledButton {...buttonProps} variant="contained">
      {children}
    </CommonStyledButton>
  )
}

export default PrimaryButton
