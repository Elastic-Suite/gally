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
  },
  lineHover: {
    '&:hover': {
      background: theme.palette.menu.hover,
      borderRadius: theme.spacing(1),
    },
  },
  linePadding: {
    marginRight: '10px',
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
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.menu.active,
  },
  indicatorLineActive: {
    position: 'absolute',
    right: '-10px',
    top: 0,
    height: '100%',
    width: 3,
    background: theme.palette.menu.active,
    boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
    borderRadius: '5px 0px 0px 5px',
  },
  heightZero: {
    opacity: 1,
    maxHeight: 'auto',
    animation: '$heightZero 2000ms forwards',
  },

  '@keyframes heightZero': {
    '0%': { maxHeight: 'auto', opacity: 1 },
    '20%': { maxHeight: 'auto', opacity: 0 },
    '100%': { maxHeight: 0, opacity: 0 },
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
    animation: '$opacityFullDeux 500ms forwards',
  },

  '@keyframes opacityFullDeux': {
    '0%': { opacity: 0 },
    '45%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
}))

const MenuItem = (props) => {
  /*
   * useStore from ReactAdmin to store data globally
   * see: https://marmelab.com/react-admin/doc/4.0/Store.html
   */
  let [childOpen, setChildOpen] = useStore(`childOpen${props.code}`, false)
  let [menuItemActive] = useStore(`menuItemActive`, '')
  const words = menuItemActive.split('_')
  const wordIndexOne = words[0] + '_' + words[1]

  const [sidebarState] = useSidebarState()
  const [sidebarStateTimeout] = useStore('sidebarStateTimeout')

  /*
   * Function to collapse or not children
   */
  const toggleChild = () => {
    setChildOpen(!childOpen)
  }

  const classes = useStyles()

  return (
    <div
      className={
        classes.root +
        (!sidebarStateTimeout
          ? ' ' + classes.opacityFull
          : ' ' + classes.heightZero)
      }
    >
      <div className={classes.linePadding}>
        {!props.children && (
          <div
            className={
              classes.lineHover +
              ' ' +
              (menuItemActive === props.code ? classes.lineActive : '')
            }
          >
            <a href={`#/${props.href}`} className={classes.line}>
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
            style={{ transition: 'all 500ms', position: 'relative' }}
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
            {!childOpen &&
            wordIndexOne === props.code &&
            words[2] !== 'boosts' ? (
              <div
                className={
                  classes.indicatorLineActive + ' ' + classes.opacityFullDeux
                }
                style={{ height: '32px' }}
              />
            ) : (
              ''
            )}
          </div>
        )}
      </div>
      {!!props.children && (
        <Collapse className={classes.children} in={childOpen}>
          {props.children.map((item, key) => (
            <MenuItem
              key={key}
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
