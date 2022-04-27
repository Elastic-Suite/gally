import IonIcon from '~/components/atoms/IonIcon'
import { makeStyles } from '@mui/styles'
import { useSidebarState, useStore } from 'react-admin'
import Collapse from '@mui/material/Collapse'

/*
 * Create function to create path from code of the menu item
 */
function slugify(code, depth) {
  let slug = code
  for (let i = 0; i < depth; i++) {
    slug = slug.replace('_', '/')
  }
  return slug
}

/*
 * Use of mui makeStyles to create multiple styles reusing theme fm react-admin
 * see: https://mui.com/system/styles/basics/
 */
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    opacity: 1,
    transition: 'all 500ms',
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    cursor: 'pointer',
    color: 'inherit',
    textDecoration: 'unset',
    fontFamily: 'inter',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '20px',
    '&:hover': {
      background: theme.palette.menu.hover,
      borderRadius: theme.spacing(1),
    },
  },
  linePadding: {
    paddingLeft: theme.spacing(2),
    color: theme.palette.menu.text500,
  },
  children: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
    transition: 'all 1000ms',
  },
  lineActive: {
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.menu.active,
  },
  indicatorLineActive: {
    width: 3,
    background: theme.palette.menu.active,
    boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
    borderRadius: '5px 0px 0px 5px',
  },
  hide: {
    opacity: 0,
  },
}))

const MenuItem = (props) => {
  /*
   * useStore from ReactAdmin to store data globally
   * see: https://marmelab.com/react-admin/doc/4.0/Store.html
   */
  let [childOpen, setChildOpen] = useStore(`childOpen${props.code}`, false)
  let [menuItemActive, setMenuItemActive] = useStore(`menuItemActive`, '')
  const [sidebarState] = useSidebarState()
  const [sidebarStateTimeout] = useStore('sidebarStateTimeout')

  /*
   * Function to collapse or not children
   */
  const toggleChild = () => {
    setChildOpen(!childOpen)
  }

  /*
   * Function to update active menu item
   */
  const clickItem = () => {
    setMenuItemActive(props.code)
  }

  const classes = useStyles()

  return (
    <div
      className={classes.root + (sidebarState ? '' : ' ' + classes.hide)}
      style={sidebarStateTimeout ? { height: 0 } : null}
    >
      <div className={classes.linePadding}>
        {!props.children && (
          <div
            className={menuItemActive === props.code ? classes.lineActive : ''}
          >
            <a
              href={`#/${props.href}`}
              className={classes.line}
              onClick={clickItem}
            >
              {props.label}
            </a>
            {menuItemActive === props.code && (
              <div className={classes.indicatorLineActive} />
            )}
          </div>
        )}
        {!!props.children && (
          <div
            className={classes.line}
            style={{ transition: 'all 500ms' }}
            onClick={toggleChild}
          >
            {props.label}
            <IonIcon
              name={'chevron-down'}
              style={
                childOpen
                  ? { transform: 'rotate(-180deg)', transition: 'all 500ms' }
                  : { transition: 'all 500ms' }
              }
            />
          </div>
        )}
      </div>
      {!!props.children && (
        <Collapse className={classes.children} in={childOpen}>
          {props.children.map((item) => (
            <MenuItem
              href={slugify(item.code, 2)}
              label={item.label}
              code={item.code}
            />
          ))}
        </Collapse>
      )}
    </div>
  )
}

export default MenuItem
