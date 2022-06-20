import { Box } from '@mui/material'

const CloseComponent = ({ close }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        left: '0',
        top: '0',
      }}
      onClick={() => close()}
    ></Box>
  )
}

export default CloseComponent
