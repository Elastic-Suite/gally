import { Box } from '@mui/material'

interface IProps {
  onClose: () => void
}

function CloseComponent({ onClose }: IProps): JSX.Element {
  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 99,
        left: '0',
        top: '0',
      }}
      onClick={onClose}
    />
  )
}

export default CloseComponent
