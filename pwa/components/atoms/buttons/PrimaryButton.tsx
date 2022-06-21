import { ReactChild } from 'react'
import Button from '@mui/material/Button'

import useCommonButtonStyle from '~/components/atoms/buttons/CommonButtonStyle'

interface IProps {
  children: ReactChild
}

const PrimaryButton = (props: IProps) => {
  const CommonButtonStyle = useCommonButtonStyle()
  return (
    <Button {...props} className={CommonButtonStyle.root} variant="contained">
      {props.children}
    </Button>
  )
}

export default PrimaryButton
