import { Collapse } from '@mui/material'
import { styled } from '@mui/system'
import Link from 'next/link'
import Image from 'next/image'
import { IMenu } from 'shared'

import Menu from '~/components/molecules/layout/Menu/Menu'

const CustomImgCollapse = styled('div')({
  position: 'absolute',
  width: 31,
  transition: 'opacity 500ms',
})

const CustomImgContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  paddingBottom: theme.spacing(6),
  paddingTop: theme.spacing(3),
  paddingLeft: theme.spacing(2.5),
  cursor: 'pointer',
}))

const CustomLeftBar = styled(Collapse)({
  borderRight: '1px solid #E2E6F3',
  boxSizing: 'unset',
  height: '100vh',
  overflowY: 'scroll',
  overflowX: 'hidden',
  position: 'fixed',
  left: '0',
  top: '0',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    width: 0,
  },
})

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  width: 278,
  minHeight: '100vh',
  background: theme.palette.background.paper,
  paddingBottom: theme.spacing(3),
}))

const CustomMenu = styled(Menu)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(2),
}))

const CustomImgExtended = styled('div')({
  position: 'absolute',
  width: 104,
  transition: 'opacity 500ms',
})

interface IProps {
  childrenState: Record<string, boolean>
  menu: IMenu
  menuItemActive: string
  onChildToggle?: (code: string, childState: boolean) => void
  sidebarState?: boolean
  sidebarStateTimeout?: boolean
}

function Sidebar(props: IProps): JSX.Element {
  const {
    childrenState,
    menu,
    menuItemActive,
    onChildToggle,
    sidebarState,
    sidebarStateTimeout,
  } = props

  /*
   * Use of Collapse from mui to collapse sidebar when button is clicked
   * see: https://mui.com/material-ui/transitions/#collapse
   */

  return (
    <CustomLeftBar
      in={sidebarState}
      orientation="horizontal"
      collapsedSize={sidebarState ? 278 : 66}
      timeout={sidebarState ? 0 : 200}
    >
      <CustomRoot style={sidebarState ? {} : { width: 'inherit' }}>
        <Link href="/" passHref as="/">
          <CustomImgContainer>
            <CustomImgExtended
              style={!sidebarStateTimeout ? {} : { opacity: 0 }}
            >
              <Image
                src="/images/LogoBlinkExtended.svg"
                alt="Logo"
                width="104"
                height="29"
              />
            </CustomImgExtended>
            <CustomImgCollapse>
              <Image
                src="/images/LogoBlinkCollapse.svg"
                alt="Logo"
                width="31"
                height="29"
              />
            </CustomImgCollapse>
          </CustomImgContainer>
        </Link>
        <CustomMenu
          childrenState={childrenState}
          menu={menu}
          menuItemActive={menuItemActive}
          onChildToggle={onChildToggle}
          sidebarState={sidebarState}
          sidebarStateTimeout={sidebarStateTimeout}
        />
      </CustomRoot>
    </CustomLeftBar>
  )
}

export default Sidebar
