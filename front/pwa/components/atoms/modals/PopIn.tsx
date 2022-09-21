import { ReactNode, useState } from 'react'
import { Box, Dialog, DialogActions } from '@mui/material'
import { styled } from '@mui/system'

import Button from '~/components/atoms/buttons/Button'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

const CustomClose = styled('div')(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  top: theme.spacing(2),
  right: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 500ms',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  color: theme.palette.colors.neutral['900'],
  '&:hover': {
    background: theme.palette.colors.neutral['200'],
  },
}))

const CustomTitle = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(9),
  textAlign: 'center',
  fontWeight: '400',
  color: theme.palette.colors.neutral[900],
  fontSize: '18px',
  fontFamily: 'Inter',
  lineHeight: '28px',
  marginBottom: theme.spacing(7),
}))

interface IProps {
  onConfirm?: () => void
  title: ReactNode
  cancelName: string
  confirmName: string
  titlePopIn: string
}

function PopIn({
  onConfirm,
  title,
  titlePopIn,
  cancelName,
  confirmName,
}: IProps): JSX.Element {
  const [open, setOpen] = useState(false)

  function handleClickOpen(): void {
    setOpen(true)
  }

  function handleClose(): void {
    setOpen(false)
  }

  function handleConfirm(): void {
    setOpen(false)
    typeof onConfirm === 'function' && onConfirm()
  }

  return (
    <div style={{ position: 'relative' }}>
      <Box onClick={handleClickOpen}>{title}</Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CustomClose onClick={handleClose}>
          <IonIcon name="close" style={{ fontSize: '17.85px' }} />
        </CustomClose>
        <CustomTitle>{titlePopIn}</CustomTitle>

        <DialogActions
          sx={{ padding: 0, marginLeft: 0, justifyContent: 'center', gap: 1 }}
        >
          <Box onClick={handleClose}>
            <Button display="tertiary" size="large">
              {cancelName}
            </Button>
          </Box>
          <Box onClick={handleConfirm}>
            <Button size="large">{confirmName}</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default PopIn
