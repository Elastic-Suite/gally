import Button from '@mui/material/Button'
import useCommonButtonStyle from '~/components/atoms/buttons/CommonButtonStyle'

const PrimaryButton = (props) => {
  const CommonButtonStyle = useCommonButtonStyle()
  return (
    <Button {...props} className={CommonButtonStyle.root} variant="contained">
      {props.children}
    </Button>
  )
}

export default PrimaryButton
