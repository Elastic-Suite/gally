import { makeStyles } from '@mui/styles'
import IonIcon from '~/components/atoms/IonIcon'
import react, { useState } from 'react'

const useStylesUser = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
    },

    help: {
        display: 'flex',
        position: 'relative',
        border: '1px solid',
        borderRadius: '8px',
        padding: '8.67px',
        borderColor: theme.palette.colors.neutral['300'],
        '&:hover': {
            cursor: 'pointer',
        },

        '&:hover::before': {
            content: '"lorem lorem lorem lorem"',
            width: 'max-content',
            maxWidth: '300px',
            position: 'absolute',
            top: '105%',
            right: '50%',
            border: '1px solid',
            borderRadius: '8px 0 8px 8px',
            borderColor: theme.palette.colors.neutral['300'],
            padding: '10px',
            backgroundColor: '#fafafb',
        },
    },

    user: {
        position: 'relative',
        alignItems: 'center',
        display: 'flex',
        border: '1px solid',
        borderRadius: '8px',
        padding: '8.67px',
        borderColor: theme.palette.colors.neutral['300'],
        '&:hover': {
            cursor: 'pointer',
        },
    },
    userName: {
        color: theme.palette.colors.neutral['800'],
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '12px',
        lineHeight: '18px',
        padding: '0 6.75px 0 9.5px',
    },
}))

const useStylesUserMenu = makeStyles((theme) => ({
    userMenu: {
        position: 'absolute',
        top: '105%',
        right: '0',
        border: '1px solid',
        borderRadius: '8px',
        borderColor: theme.palette.colors.neutral['300'],
        padding: '10px',
        backgroundColor: '#fafafb',
        width: '100%',
        cursor: 'initial',
    },
}))

const UserMenu = () => {
    const usermenustyle = useStylesUserMenu()

    return (
        <div className={usermenustyle.userMenu}>
            <div>Mon compte</div>
            <div>Mon compte</div>
            <div>Mon compte</div>
            <div>Mon compte</div>
        </div>
    )
}

const User = () => {
    const userstyle = useStylesUser()

    const [openUserMenu, setOpenUserMenu] = useState(false)
    return (
        <div className={userstyle.root}>
            <div className={userstyle.help}>
                <IonIcon name="help" style={{ width: '14,67px' }} />
            </div>
            <div
                className={userstyle.user}
                onClick={() => setOpenUserMenu(!openUserMenu)}
            >
                <IonIcon name="user" style={{ width: '13px' }} />
                <div className={userstyle.userName}>Admin Name</div>
                <IonIcon name="arrow" style={{ width: '13px' }} />
                {openUserMenu && <UserMenu />}
            </div>
        </div>
    )
}

export default User
