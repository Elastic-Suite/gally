import { makeStyles } from '@mui/styles'
import IonIcon from '~/components/atoms/IonIcon'
import { useState } from 'react'
import { Theme } from '@mui/material/styles'
import { useRef } from 'react'
import HelpOver from '~/components/molecules/layout/user/helpOver.tsx'
import UserMenu from '~/components/molecules/layout/user/userMenu.tsx'

const useStylesUser = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },

  help: {
    display: 'flex',
    position: 'relative',
    border: '1px solid',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    borderColor: theme.palette.colors.neutral['300'],
    cursor: 'pointer',
    '&::before': {
      content: "''",
      position: 'absolute',
      top: '100%',
      height: '4px',
      left: '0',
      width: '100%',
    },
  },

  helpVisible: {
    width: 'max-content',
    position: 'absolute',
    top: `calc(100% + 4px)`,
    left: '0',
    border: '1px solid',
    borderRadius: theme.spacing(1),
    borderColor: theme.palette.colors.neutral['300'],
    backgroundColor: '#fafafb',
  },

  user: {
    position: 'relative',
    alignItems: 'center',
    display: 'flex',
    border: '1px solid',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    borderColor: theme.palette.colors.neutral['300'],
    cursor: 'pointer',
  },
  userName: {
    color: theme.palette.colors.neutral['800'],
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '18px',
  },

  arrow: {
    transition: 'transform 300ms',
    display: 'flex',
  },

  arrowRotate: {
    transform: 'rotate(180deg)',
  },

  userMenu: {
    transition: 'opacity 500ms ,height 500ms',
    position: 'absolute',
    top: `calc(100% + 4px)`,
    right: '0',
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    border: '1px solid',
    borderRadius: theme.spacing(1),
    borderColor: theme.palette.colors.neutral['300'],
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1.25),
    paddingLeft: theme.spacing(1.25),
    backgroundColor: '#fafafb',
    width: '206px',
    cursor: 'initial',
  },

  userMenuVisible: {
    opacity: 1,
  },
}))

const User = () => {
  const userstyle = useStylesUser()

  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [helpVisible, setHelpVisible] = useState(false)

  const useMenu = useRef(null)
  return (
    <div className={userstyle.root}>
      <div
        className={userstyle.help}
        onMouseOver={() => (setHelpVisible(true), setOpenUserMenu(false))}
        onMouseLeave={() => setHelpVisible(false)}
      >
        <IonIcon name="help-circle-outline" style={{ width: '14,67px' }} />
        {helpVisible && (
          <div className={userstyle.helpVisible}>{<HelpOver />}</div>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <div
          className={userstyle.user}
          onClick={() => setOpenUserMenu(!openUserMenu)}
        >
          <IonIcon name="person-outline" style={{ width: '13px' }} />
          <div className={userstyle.userName}>Admin Name</div>
          <div
            className={
              userstyle.arrow + ' ' + (openUserMenu && userstyle.arrowRotate)
            }
          >
            <IonIcon name="chevron-down" style={{ width: '16px' }} />
          </div>
        </div>

        <div
          ref={useMenu}
          className={
            userstyle.userMenu +
            ' ' +
            (openUserMenu && userstyle.userMenuVisible)
          }
          style={openUserMenu ? { height: useMenu?.current?.scrollHeight } : {}}
        >
          <UserMenu />
        </div>
      </div>
    </div>
  )
}

export default User
