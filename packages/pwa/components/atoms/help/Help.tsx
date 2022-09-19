import { useRef, useState } from 'react'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import HelpOver from './HelpOver'
import { styled } from '@mui/system'

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
  width: 'max-content',
  position: 'absolute',
  top: `calc(100% + 4px)`,
  left: '0',
  border: '1px solid',
  borderRadius: 8,
  borderColor: theme.palette.colors.neutral['300'],
  backgroundColor: theme.palette.background.default,
  opacity: 0,
  height: 0,
  overflow: 'hidden',
  transition: 'opacity 500ms ,height 500ms',
}))

function Help(): JSX.Element {
  const [helpVisible, setHelpVisible] = useState(false)
  const useHelp = useRef(null)

  return (
    <CustomHelp
      onMouseOver={(): void => setHelpVisible(true)}
      onMouseLeave={(): void => setHelpVisible(false)}
      onFocus={(): void => setHelpVisible(true)}
      onBlur={(): void => setHelpVisible(false)}
    >
      <IonIcon
        name="help-circle-outline"
        style={{ fontSize: '18px', color: '#8187B9' }}
      />
      <CustomHelpInit
        ref={useHelp}
        style={
          helpVisible
            ? { height: useHelp?.current?.scrollHeight, opacity: 1 }
            : {}
        }
      >
        <HelpOver />
      </CustomHelpInit>
    </CustomHelp>
  )
}

export default Help
