import { useRef, useState } from 'react'
import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import HelpOver from './HelpOver'

const useStylesHelp = makeStyles((theme: Theme) => ({
  help: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
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
  },

  helpInit: {
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
  },

  helpVisible: {
    opacity: 1,
  },
}))

function Help() {
  const helpstyle = useStylesHelp()
  const [helpVisible, setHelpVisible] = useState(false)
  const useHelp = useRef(null)

  return (
    <button
      className={helpstyle.help}
      onMouseOver={() => setHelpVisible(true)}
      onMouseLeave={() => setHelpVisible(false)}
      onFocus={() => setHelpVisible(true)}
      onBlur={() => setHelpVisible(false)}
    >
      <IonIcon
        name="help-circle-outline"
        style={{ fontSize: '18px', color: '#8187B9' }}
      />
      <div
        ref={useHelp}
        className={
          helpstyle.helpInit + ' ' + (helpVisible && helpstyle.helpVisible)
        }
        style={helpVisible ? { height: useHelp?.current?.scrollHeight } : {}}
      >
        <HelpOver />
      </div>
    </button>
  )
}

export default Help
