import { makeStyles } from '@mui/styles'
import IonIcon from '~/components/atoms/IonIcon'
import { useState } from 'react'

const useStylesUserMenu = makeStyles((theme) => ({
    userMenu: {
        position: 'absolute',
        top: `calc(100% + 4px)`,
        right: '0',
        border: '1px solid',
        borderRadius: '8px',
        borderColor: theme.palette.colors.neutral['300'],
        padding: '8px 12px',
        backgroundColor: '#fafafb',
        width: '206px',
        cursor: 'initial',
        padding: '8px 12px',
    },
    typoTexte: {
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '12px',
        lineHeight: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    typoUsername: {
        fontWeight: '600',
        color: theme.palette.colors.neutral['800'],
    },
    typoEmail: {
        fontWeight: '400',
        color: theme.palette.colors.neutral['600'],
    },
    typoBasic: {
        fontWeight: '400',
        color: theme.palette.colors.neutral['800'],
    },
    hr: {
        width: '100%',
        border: '1px solid',
        margin: '0',
        borderColor: theme.palette.colors.neutral['300'],
    },
}))

const UserMenu = () => {
    const usermenustyle = useStylesUserMenu()

    return (
        <div className={usermenustyle.userMenu + ' ' + usermenustyle.typoTexte}>
            <div className={usermenustyle.typoUsername}>Admin name</div>
            <div className={usermenustyle.typoEmail}>adminame@mail.com</div>
            <hr className={usermenustyle.hr} />
            <div className={usermenustyle.typoBasic}>Account</div>
            <div className={usermenustyle.typoBasic}>Log out</div>
        </div>
    )
}

const useStylesHelpOver = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px 12px',
    },
    texte: {
        color: theme.palette.colors.neutral['800'],
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '18px',
    },
}))

const HelpOver = () => {
    const helpoverstyle = useStylesHelpOver()

    return (
        <div className={helpoverstyle.root + ' ' + helpoverstyle.texte}>
            <div>Helpdesk</div>
            <div>User guide</div>
        </div>
    )
}

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
        borderRadius: '8px',
        borderColor: theme.palette.colors.neutral['300'],
        backgroundColor: '#fafafb',
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

    arrow: {
        transform: 'rotate(180deg)',
    },
}))

const User = () => {
    const userstyle = useStylesUser()

    const [openUserMenu, setOpenUserMenu] = useState(false)
    const [helpVisible, setHelpVisible] = useState(false)
    return (
        <div className={userstyle.root}>
            <div
                className={userstyle.help}
                onMouseOver={() => setHelpVisible(true)}
                onMouseLeave={() => setHelpVisible(false)}
            >
                <IonIcon name="help" style={{ width: '14,67px' }} />
                {helpVisible && (
                    <div className={userstyle.helpVisible}>{<HelpOver />}</div>
                )}
                {console.log(helpVisible)}
            </div>
            <div
                className={userstyle.user}
                onClick={() => setOpenUserMenu(!openUserMenu)}
            >
                <IonIcon name="user" style={{ width: '13px' }} />
                <div className={userstyle.userName}>Admin Name</div>
                <IonIcon
                    name="arrow"
                    style={
                        openUserMenu
                            ? { transform: 'rotate(180deg)', width: '13px' }
                            : { width: '13px' }
                    }
                />
                {openUserMenu && <UserMenu />}
            </div>
        </div>
    )
}

export default User
