import IonIcon from '~/components/atoms/IonIcon'
import { makeStyles } from '@mui/styles'
import { useSidebarState, useStore } from 'react-admin'

/*
 * Use of mui makeStyles to create multiple styles reusing theme fm react-admin
 * see: https://mui.com/system/styles/basics/
 */
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    textDecoration: 'unset',
    color: 'inherit',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
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
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.menu.active,
    flex: 1,
  },
  indicatorLineActive: {
    position: 'absolute',
    right: 0,
    width: 3,
    height: 36,
    background: theme.palette.menu.active,
    boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
    borderRadius: '5px 0px 0px 5px',
  },
  span: {
    opacity: 1,
    transition: 'all 500ms',
  },
  hide: {
    opacity: 0,
    height: 0,
  },
}))

const MenuItemIcon = (props) => {
  /*
   * useStore from ReactAdmin to store data globally
   * see: https://marmelab.com/react-admin/doc/4.0/Store.html
   */
  let [menuItemActive] = useStore(`menuItemActive`, '')
  const [sidebarState] = useSidebarState()
  const [sidebarStateTimeout] = useStore('sidebarStateTimeout')

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
        <IonIcon name={props.code} style={{ width: 16, height: 16 }} />
        <span
          className={classes.span + (sidebarState ? '' : ' ' + classes.hide)}
          style={sidebarStateTimeout ? { width: 0 } : null}
        >
          {props.label}
        </span>
      </div>
    )
  } else {
    return (
      <div
        className={
          classes.noChildHover +
          ' ' +
          (menuItemActive === props.code
            ? classes.lineActive + ' ' + classNameStyle
            : classNameStyle)
        }
      >
        <a href={`#/${props.href}`} className={classNameRoot}>
          <IonIcon name={props.code} style={{ width: 16, height: 16 }} />
          <span
            className={classes.span + (sidebarState ? '' : ' ' + classes.hide)}
            style={sidebarStateTimeout ? { width: 0 } : null}
          >
            {props.label}
          </span>
        </a>
        {menuItemActive === props.code && (
          <div className={classes.indicatorLineActive} />
        )}
      </div>
    )
  }
}

export default MenuItemIcon
