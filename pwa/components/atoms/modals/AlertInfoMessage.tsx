import { useState } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import Button from '@mui/material/Button'

interface IProps {
  title: string
  dev: boolean
}

export default function AlertInfoMessage({ title, dev }: IProps) {
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
              onClick={() => {
                setOpen(false)
              }}
            >
              <IonIcon name="close" style={{ fontSize: 12, padding: '0px' }} />
            </IconButton>
          }
        >
          {title}
        </Alert>
      </Collapse>
      {dev && (
        <Button
          style={{ marginTop: '10px' }}
          disabled={open}
          variant="outlined"
          onClick={() => {
            setOpen(true)
          }}
        >
          Re-open
        </Button>
      )}
    </Box>
  )
}

AlertInfoMessage.defaultProps = {
  title: '',
  dev: false,
}
