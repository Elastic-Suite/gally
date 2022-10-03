import { useEffect } from 'react'
import { AlertProps, IconButton, Alert as MuiAlert } from '@mui/material'
import { styled } from '@mui/system'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

const StyledAlert = styled(MuiAlert)(({ severity, theme }) => ({
  padding: `6px ${theme.spacing(2)}`,
  background: theme.palette.colors.neutral[200],
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  color: theme.palette.colors.neutral[600],
  borderRadius: 8,
  alignItems: 'center',
  ...(severity === 'success' && {
    background: theme.palette.success.light,
    color: theme.palette.success.main,
  }),
  ...(severity === 'warning' && {
    background: theme.palette.warning.light,
    color: theme.palette.warning.main,
  }),
  ...(severity === 'error' && {
    background: theme.palette.error.light,
    color: theme.palette.error.main,
  }),
  '& .MuiAlert-icon': {
    color: 'inherit',
    marginRight: theme.spacing(1),
  },
  '& .MuiAlert-message': {
    padding: 0,
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '18px',
  },
  '& .MuiAlert-action': {
    paddingLeft: '10px',
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },
}))

export interface IAlertProps extends AlertProps {
  delay?: number
  message: string
  onClose?: () => void
}

export default function Alert(props: IAlertProps): JSX.Element {
  const { delay, message, onClose, ...alertProps } = props

  useEffect(() => {
    if (delay) {
      const timeout = setTimeout(onClose, delay)
      return () => clearTimeout(timeout)
    }
  }, [delay, onClose])

  return (
    <StyledAlert
      {...alertProps}
      sx={{ mb: 0 }}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
        >
          <IonIcon name="close" style={{ fontSize: 18, padding: '0px' }} />
        </IconButton>
      }
    >
      {message}
    </StyledAlert>
  )
}

Alert.defaultProps = {
  severity: 'info',
}
