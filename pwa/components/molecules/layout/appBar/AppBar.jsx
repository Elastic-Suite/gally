import { makeStyles } from '@mui/styles'
import BreadCrumb from '~/components/atoms/breadcrumb/BreadCrumb'
import User from '~/components/atoms/user/User'
import { useSidebarState } from 'react-admin'

const useStylesAppBar = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing(1.25),
        paddingBottom: theme.spacing(1.25),
        paddingRight: theme.spacing(4),
        paddingLeft: theme.spacing(4),
        position: 'fixed',
        right: 0,
        zIndex: '9',
        height: theme.spacing(8),
        backgroundColor: '#fafafb',
        left: 'inherit',

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
        <div className={appbarstyle.root}>
            <BreadCrumb />
            <User />
        </div>
    )
}

export default AppBar
