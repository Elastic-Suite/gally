import { ButtonProps } from '@mui/material'

import { PrimaryButton, SecondaryButton, TertiaryButton } from './Button.styled'

interface IProps extends ButtonProps {
  display: 'primary' | 'secondary' | 'tertiary'
}

function Button(props: IProps): JSX.Element {
  const { display, ...buttonProps } = props

  switch (display) {
    case 'secondary':
      return <SecondaryButton {...buttonProps} />

    case 'tertiary':
      return <TertiaryButton {...buttonProps} />

    default:
      return <PrimaryButton {...buttonProps} />
  }
}

Button.defaultProps = {
  display: 'primary',
  variant: 'contained',
}

export default Button
