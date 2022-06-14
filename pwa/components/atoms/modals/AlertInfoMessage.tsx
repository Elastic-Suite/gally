import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import IonIcon from '~/components/atoms/IonIcon'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'

export default function AlertInfoMessage({ title, dev }) {
  const [open, setOpen] = useState(true)

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          sx={{ mb: 0 }} // add Margin Bottom
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false)
              }}
            >
              <IonIcon name="close" style={{ fontSize: 8.5, padding: '0px' }} />
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

AlertInfoMessage.propTypes = {
  title: PropTypes.string,
  dev: PropTypes.bool,
}

AlertInfoMessage.defaultProps = {
  title: '',
  dev: false,
}
