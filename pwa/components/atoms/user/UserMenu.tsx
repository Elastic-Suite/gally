import { useRef, useState } from 'react'
import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import CloseComponent from '../closeComponent/CloseComponent'
import { Box } from '@mui/material'
import UserMenuShow from './UserMenuShow'

const useStylesUserMenu = makeStyles((theme: Theme) => ({
  user: {
    position: 'relative',
    alignItems: 'center',
    display: 'flex',
    border: '1px solid',
    borderRadius: 8,
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    borderColor: theme.palette.colors.neutral['300'],
    cursor: 'pointer',
    background: theme.palette.background.default,
    transition: 'background 500ms',
    zIndex: 999,
    '&:hover': {
      background: theme.palette.colors.neutral[300],
    },
  },
  userName: {
    color: theme.palette.colors.neutral['800'],
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '18px',
    fontFamily: 'Inter',
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
    borderRadius: 8,
    borderColor: theme.palette.colors.neutral['300'],
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1.25),
    paddingLeft: theme.spacing(1.25),
    background: theme.palette.background.default,
    width: '206px',
    cursor: 'initial',
    zIndex: 999,
  },

  userMenuVisible: {
    opacity: 1,
  },
}))

function UserMenu() {
  const usermenustyle = useStylesUserMenu()
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const useMenu = useRef(null)

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Box
          className={usermenustyle.user}
          onClick={() => setOpenUserMenu(!openUserMenu)}
        >
          <IonIcon
            name="person-outline"
            style={{ fontSize: '15px', color: '#8187B9' }}
          />
          <div className={usermenustyle.userName}>Admin Name</div>
          <div
            className={
              usermenustyle.arrow +
              ' ' +
              (openUserMenu && usermenustyle.arrowRotate)
            }
          >
            <IonIcon
              name="chevron-down"
              style={{ fontSize: '15px', color: '#8187B9' }}
            />
          </div>
        </Box>

        <div
          ref={useMenu}
          className={
            usermenustyle.userMenu +
            ' ' +
            (openUserMenu && usermenustyle.userMenuVisible)
          }
          style={openUserMenu ? { height: useMenu?.current?.scrollTopMax } : {}}
        >
          <UserMenuShow />
        </div>
      </div>
      {openUserMenu && (
        <CloseComponent onClose={() => setOpenUserMenu(false)} />
      )}
    </>
  )
}

export default UserMenu
