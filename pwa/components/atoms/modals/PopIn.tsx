import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'

import { styled } from '@mui/material/styles'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'
import { Box } from '@mui/material'

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
  onConfirm: () => void
  title: string[]
  cancelName: string
  confirmName: string
  titlePopIn: string
}

const PopIn = ({
  onConfirm,
  title,
  titlePopIn,
  cancelName,
  confirmName,
}: IProps) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = () => {
    setOpen(false)
    onConfirm()
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
            <TertiaryButton size="large">{cancelName}</TertiaryButton>
          </Box>
          <Box onClick={handleConfirm}>
            <PrimaryButton size="large">{confirmName}</PrimaryButton>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default PopIn
