import { makeStyles } from '@mui/styles'
import BreadCrumb from '~/components/appBar/breadcrumb/BreadCrum'
import User from '~/components/appBar/user/User'
import { useSidebarState } from 'react-admin'
const useStylesAppBar = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 32px',
        position: 'fixed',
        right: 0,
        zIndex: '9',
        height: '65px',
        backgroundColor: '#fafafb',

        '&::before': {
            content: '""',
            position: 'absolute',
            border: '1px solid',
            borderColor: theme.palette.colors.neutral['300'],
            bottom: 0,
            width: `calc(100% - 64px)`,
        },
    },
}))

const AppBar = () => {
    const [sidebarState, setSidebarState] = useSidebarState()

    const appbarstyle = useStylesAppBar()
    return (
        <div
            className={appbarstyle.root}
            style={{
                left: sidebarState ? '279px' : '66px',
            }}
        >
            <BreadCrumb />
            <User />
        </div>
    )
}

export default AppBar
