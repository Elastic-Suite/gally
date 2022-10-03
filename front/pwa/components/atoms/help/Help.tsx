import { useState } from 'react'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import HelpOver from './HelpOver'
import { styled } from '@mui/system'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'

const CustomHelp = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  fontFamily: 'Inter',
  border: '1px solid',
  borderRadius: 8,
  padding: theme.spacing(1),
  borderColor: theme.palette.colors.neutral['300'],
  cursor: 'pointer',
  zIndex: 9999,
  background: theme.palette.background.default,
  transition: 'background 500ms',
  '&:hover': {
    background: theme.palette.colors.neutral[300],
  },
  '&::before': {
    content: "''",
    position: 'absolute',
    top: '100%',
    height: '4px',
    left: '0',
    width: '100%',
  },
}))

const CustomHelpInit = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(0.4),
  width: 'max-content',
  border: '1px solid',
  borderRadius: 8,
  borderColor: theme.palette.colors.neutral['300'],
  backgroundColor: theme.palette.background.default,
}))

function Help(): JSX.Element {
  const [helpVisible, setHelpVisible] = useState(false)

  return (
    <Box
      onMouseOver={(): void => setHelpVisible(true)}
      onMouseLeave={(): void => setHelpVisible(false)}
      onFocus={(): void => setHelpVisible(true)}
      onBlur={(): void => setHelpVisible(false)}
    >
      <CustomHelp>
        <IonIcon
          name="help-circle-outline"
          style={{ fontSize: '18px', color: '#8187B9' }}
        />
      </CustomHelp>
      <Box sx={{ position: 'relative' }}>
        <Collapse in={helpVisible} sx={{ position: 'absolute', right: 0 }}>
          <CustomHelpInit>
            <HelpOver />
          </CustomHelpInit>
        </Collapse>
      </Box>
    </Box>
  )
}

export default Help
