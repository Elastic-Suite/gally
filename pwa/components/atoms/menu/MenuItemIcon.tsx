import IonIcon from '~/components/atoms/IonIcon'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import Link from 'next/link'
import { useAppSelector } from '~/store'

/*
 * Use of mui makeStyles to create multiple styles reusing theme fm react-admin
 * see: https://mui.com/system/styles/basics/
 */
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    textDecoration: 'unset',
    color: 'inherit',
    padding: theme.spacing(1),
    '& ion-icon': {
      color: theme.palette.menu.text500,
    },
  },
  childPadding: {
    paddingBottom: theme.spacing(1),
  },
  boldStyle: {
    fontFamily: 'inter',
    fontWeight: 600,
    fontSize: 13,
    lineHeight: '20px',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: theme.palette.menu.text600,
  },
  lightStyle: {
    fontFamily: 'inter',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.menu.text500,
  },
  noChildHover: {
    '&:hover': {
      background: theme.palette.menu.hover,
      borderRadius: theme.spacing(1),
    },
  },
  lineActive: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.menu.active,
    flex: 1,
  },
  indicatorLineActive: {
    position: 'absolute',
    right: 0,
    width: 3,
    background: theme.palette.menu.active,
    boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
    borderRadius: '5px 0px 0px 5px',
  },
  indicatorLineActiveTwo: {
    width: 3,
    background: theme.palette.menu.active,
    boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
    borderRadius: '5px 0px 0px 5px',
  },
  opacityFull: {
    opacity: 0,
    animation: '$opacityFull 1000ms forwards',
  },
  '@keyframes opacityFull': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  opacityFullDeux: {
    opacity: 0,
    animation: '$opacityFullDeux 1200ms forwards',
  },
  '@keyframes opacityFullDeux': {
    '0%': { opacity: 0 },
    '45%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  span: {
    opacity: 1,
    transition: 'all 500ms',
  },
  hide: {
    opacity: 0,
    height: 0,
  },
  heightZero: {
    opacity: 1,
    maxHeight: 'initial',
    maxWidth: 'initial',
    animation: '$heightZero 1400ms forwards',
    position: 'relative',
  },
  '@keyframes heightZero': {
    '0%': {
      maxHeight: 'initial',
      maxWidth: 'initial',
      opacity: 1,
      position: 'relative',
    },
    '20%': {
      maxHeight: 'initial',
      maxWidth: 'initial',
      opacity: 0,
      position: 'relative',
    },
    '100%': { maxHeight: 0, maxWidth: 0, opacity: 0, position: 'absolute' },
  },
}))

const MenuItemIcon = (props) => {
  const menuItemActive =
    useAppSelector((state) => state.menu.menuItemActive) || ''
  const sidebarState = useAppSelector((state) => state.menu.sidebarState)
  const sidebarStateTimeout = useAppSelector(
    (state) => state.menu.sidebarStateTimeout
  )

  const words = menuItemActive.split('_')
  const wordIndexOne = words[0]

  const classes = useStyles()
  let classNameRoot = classes.root
  let classNameStyle = ''
  if (props.lightStyle) {
    classNameStyle += classes.lightStyle
  } else {
    classNameStyle += classes.boldStyle
  }

  /*
   * Verification and return of specific data if the item has children
   */
  if (props.childPadding) {
    classNameRoot += ' ' + classes.childPadding
    return (
      <div className={classNameRoot + ' ' + classNameStyle}>
        <IonIcon name={props.code} style={{ width: 18, height: 18 }} />
        {sidebarStateTimeout && wordIndexOne === props.code ? (
          <div
            className={
              classes.indicatorLineActive + ' ' + classes.opacityFullDeux
            }
            style={{ height: '32px' }}
          />
        ) : (
          ''
        )}

        <span
          className={
            classes.span +
            (!sidebarStateTimeout
              ? ' ' + classes.opacityFull
              : ' ' + classes.heightZero)
          }
        >
          {props.label}
        </span>
      </div>
    )
  } else {
    return (
      <div
        className={
          menuItemActive === props.code
            ? classes.lineActive + ' ' + classNameStyle
            : classNameStyle
        }
      >
        <Link href="/admin/[[...slug]]" as={`/admin/${props.href}`}>
          <a
            className={classNameRoot + ' ' + classes.noChildHover}
            style={
              sidebarState
                ? { width: 'calc(100% - 10px)' }
                : { width: 'fit-content' }
            }
          >
            <IonIcon name={props.code} style={{ width: 18, height: 18 }} />

            <span
              className={
                classes.span +
                (!sidebarStateTimeout
                  ? ' ' + classes.opacityFull
                  : ' ' + classes.heightZero)
              }
            >
              {props.label}
            </span>
          </a>
        </Link>
        {menuItemActive === props.code && (
          <div
            className={
              classes.indicatorLineActiveTwo +
              (sidebarStateTimeout ? ' ' + classes.opacityFullDeux : '')
            }
          />
        )}
      </div>
    )
  }
}

export default MenuItemIcon
