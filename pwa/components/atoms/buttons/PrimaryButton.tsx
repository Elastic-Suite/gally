import Button from '@mui/material/Button'
import CommonButtonStyle from "~/components/atoms/buttons/CommonButtonStyle";

const PrimaryButton = (props) => {
  return (
    <Button {...props}
      sx={CommonButtonStyle}
      variant="contained"
    >
      {props.children}
    </Button>
  )
}

export default PrimaryButton
