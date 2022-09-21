import { useRef, useState } from 'react'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import CloseComponent from '../closeComponent/CloseComponent'
import UserMenuShow from './UserMenuShow'
import { styled } from '@mui/system'

const CustomUser = styled('div')(({ theme }) => ({
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
}))

const CustomUserName = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral['800'],
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '18px',
  fontFamily: 'Inter',
}))

const CustomArrow = styled('div')({
  transition: 'transform 300ms',
  display: 'flex',
})

const CustomUserMenu = styled('div')(({ theme }) => ({
  transition: 'opacity 500ms ,height 500ms',
  position: 'absolute',
  top: `calc(100% + 4px)`,
  right: '0',
  opacity: 0,
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
}))

function UserMenu(): JSX.Element {
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const useMenu = useRef(null)

  return (
    <>
      <div style={{ position: 'relative' }}>
        <CustomUser onClick={(): void => setOpenUserMenu(!openUserMenu)}>
          <IonIcon
            name="person-outline"
            style={{ fontSize: '15px', color: '#8187B9' }}
          />
          <CustomUserName>Admin Name</CustomUserName>
          <CustomArrow
            style={openUserMenu ? { transform: 'rotate(180deg)' } : {}}
          >
            <IonIcon
              name="chevron-down"
              style={{ fontSize: '15px', color: '#8187B9' }}
            />
          </CustomArrow>
        </CustomUser>

        <CustomUserMenu
          ref={useMenu}
          style={openUserMenu ? { opacity: 1 } : {}}
        >
          <UserMenuShow />
        </CustomUserMenu>
      </div>
      {openUserMenu ? (
        <CloseComponent onClose={(): void => setOpenUserMenu(false)} />
      ) : null}
    </>
  )
}

export default UserMenu
