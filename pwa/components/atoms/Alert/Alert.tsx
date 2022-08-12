import { AlertProps, IconButton, Alert as MuiAlert } from '@mui/material'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

interface IProps extends AlertProps {
  message: string
  onClose?: () => void
}

export default function Alert(props: IProps): JSX.Element {
  const { message, onClose, ...alertProps } = props

  return (
    <MuiAlert
      {...alertProps}
      sx={{ mb: 0 }}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
        >
          <IonIcon name="close" style={{ fontSize: 12, padding: '0px' }} />
        </IconButton>
      }
    >
      {message}
    </MuiAlert>
  )
}
