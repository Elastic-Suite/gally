import { ReactNode, useCallback, useContext, useEffect } from 'react'
import { styled } from '@mui/system'

import { breadcrumbContext } from '~/contexts'
import { useApiFetch, useUser } from '~/hooks'
import {
  selectChildrenState,
  selectMenu,
  selectMenuItemActive,
  selectSidebarState,
  selectSidebarStateTimeout,
  setChildState,
  setMenu,
  setMenuItemActive,
  setSidebarState,
  setSidebarStateTimeout,
  useAppDispatch,
  useAppSelector,
} from '~/store'

import AppBar from '~/components/molecules/layout/appBar/AppBar'
import Sidebar from '~/components/molecules/layout/Sidebar/Sidebar'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import Messages from '~/components/stateful/Messages/Messages'
import { IMenu, LoadStatus, isError } from 'shared'

/*
 * TODO: THIBO: Update AppBar
 * Custom Layout to implement blueprints
 * See: https://marmelab.com/react-admin/Theming.html#using-a-custom-layout
 */

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
}))

const CustomAppFrame = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  overflowX: 'auto',
  minHeight: '100vh',
})

const CustomContentWithAppBar = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  width: 'auto',
  boxSizing: 'border-box',
  height: '100vh',
  overflowY: 'scroll',
  overflowX: 'hidden',
  position: 'fixed',
  top: '0',
  right: '0',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    width: 0,
  },
})

const CustomContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 2,
  paddingTop: '156px',
  paddingBottom: theme.spacing(5),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  backgroundColor: theme.palette.background.page,
}))

const CustomButtonCollapse = styled('button')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  top: theme.spacing(6),
  background: theme.palette.background.paper,
  border: '1px solid #E2E6F3',
  boxSizing: 'border-box',
  borderRadius: theme.spacing(2),
  width: theme.spacing(4),
  height: theme.spacing(4),
  cursor: 'pointer',
  zIndex: '99',
}))

const CustomToClose = styled(CustomButtonCollapse)({
  left: 'calc(66px - 16px)',
  transition: 'left linear',
})

const CustomToOpen = styled(CustomButtonCollapse)({
  left: 'calc(279px - 16px)',
  transition: 'left linear',
})

interface IProps {
  children: ReactNode
}

function Layout({ children }: IProps): JSX.Element {
  const dispatch = useAppDispatch()
  const sidebarState = useAppSelector(selectSidebarState)
  const sidebarStateTimeout = useAppSelector(selectSidebarStateTimeout)
  const menuItemActive = useAppSelector(selectMenuItemActive) || ''
  const childrenState = useAppSelector(selectChildrenState)
  const menu = useAppSelector(selectMenu)
  const [breadcrumb] = useContext(breadcrumbContext)
  const fetchApi = useApiFetch()
  const user = useUser()

  // Load menu
  useEffect(() => {
    if (user) {
      dispatch(setMenu({ status: LoadStatus.LOADING }))
      fetchApi<IMenu>('menu').then((json) => {
        if (isError(json)) {
          dispatch(setMenu({ error: json.error, status: LoadStatus.FAILED }))
        } else {
          dispatch(setMenu({ data: json, status: LoadStatus.SUCCEEDED }))
        }
      })
    }
  }, [dispatch, fetchApi, user])

  useEffect(() => {
    dispatch(setMenuItemActive(breadcrumb?.join('_')))
  }, [dispatch, breadcrumb])

  // function to collapse sidebar when click on button
  function collapseSidebar(): void {
    if (sidebarState) {
      setTimeout(() => {
        dispatch(setSidebarState(!sidebarState))
      }, 500)
    } else {
      dispatch(setSidebarState(!sidebarState))
    }
    dispatch(setSidebarStateTimeout(sidebarState))
  }

  // Function to collapse or not children
  const toggleChild = useCallback(
    (code: string, childState: boolean) => {
      dispatch(setChildState({ code, value: childState }))
    },
    [dispatch]
  )

  const Collapse = !sidebarState ? CustomToClose : CustomToOpen

  return (
    <CustomRoot>
      <CustomAppFrame>
        <Sidebar
          childrenState={childrenState}
          menu={menu}
          menuItemActive={menuItemActive}
          onChildToggle={toggleChild}
          sidebarState={sidebarState}
          sidebarStateTimeout={sidebarStateTimeout}
        />
        <CustomContentWithAppBar
          style={{
            left: sidebarState ? '279px' : '67px',
          }}
        >
          <Collapse onClick={collapseSidebar}>
            <IonIcon name="code-outline" style={{ width: 18, height: 18 }} />
          </Collapse>
          <AppBar slug={breadcrumb} menu={menu} />
          <CustomContent>
            <Messages />
            {children}
          </CustomContent>
        </CustomContentWithAppBar>
        {/*<Notification /> TODO: Set here Notification component*/}
      </CustomAppFrame>
    </CustomRoot>
  )
}

export default Layout
