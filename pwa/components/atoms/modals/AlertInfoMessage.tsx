import { useState } from 'react'
import { Alert, Box, Button, Collapse, IconButton } from '@mui/material'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

interface IProps {
  title: string
  dev: boolean
}

export default function AlertInfoMessage({ title, dev }: IProps): JSX.Element {
  const [open, setOpen] = useState(true)

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          sx={{ mb: 0 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={(): void => setOpen(false)}
            >
              <IonIcon name="close" style={{ fontSize: 12, padding: '0px' }} />
            </IconButton>
          }
        >
          {title}
        </Alert>
      </Collapse>
      {dev ? (
        <Button
          style={{ marginTop: '10px' }}
          disabled={open}
          variant="outlined"
          onClick={(): void => setOpen(true)}
        >
          Re-open
        </Button>
      ) : null}
    </Box>
  )
}

AlertInfoMessage.defaultProps = {
  dev: false,
  title: '',
}
