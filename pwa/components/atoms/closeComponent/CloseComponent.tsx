import { Box } from '@mui/material'

interface IProps {
  onClose: Function
}

const CloseComponent = ({ onClose }: IProps) => {
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
      onClick={() => onClose()}
    ></Box>
  )
}

export default CloseComponent
