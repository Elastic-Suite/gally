import { ReactChild } from 'react'
import Button, { ButtonProps } from '@mui/material/Button'

import useCommonButtonStyle from '~/components/atoms/buttons/CommonButtonStyle'

interface IProps extends ButtonProps {
  children: ReactChild
}

function PrimaryButton(props: IProps) {
  const { children, ...buttonProps } = props
  const CommonButtonStyle = useCommonButtonStyle()
  return (
    <Button
      {...buttonProps}
      className={CommonButtonStyle.root}
      variant="contained"
    >
      {children}
    </Button>
  )
}

export default PrimaryButton
