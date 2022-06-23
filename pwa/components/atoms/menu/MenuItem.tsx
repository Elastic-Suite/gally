import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import Collapse from '@mui/material/Collapse'
import Link from 'next/link'

import { IMenuChild } from '~/store'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

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
const useStyles = makeStyles((theme: Theme) => ({
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
    background: 'transparent',
    border: 0,
  },
  lineHover: {
    '&:hover': {
      background: theme.palette.menu.hover,
      borderRadius: 8,
    },
  },
  linePadding: {
    marginRight: theme.spacing(2),
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
    right: theme.spacing(-2),
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

interface IProps {
  childrenState: Record<string, boolean>
  code: string
  href: string
  isActive?: boolean
  isBoosts?: boolean
  label: string
  menuChildren?: IMenuChild[]
  onToggle: (code: string, childState: boolean) => void
  sidebarStateTimeout?: boolean
  words: string[]
}

function MenuItem(props: IProps) {
  const {
    childrenState,
    code,
    href,
    isActive,
    isBoosts,
    label,
    menuChildren,
    onToggle,
    sidebarStateTimeout,
    words,
  } = props
  const childState = childrenState[code]
  const classes = useStyles()

  function toggleChild() {
    onToggle(code, !childState)
  }

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
        {!menuChildren && (
          <div
            className={
              classes.lineHover + ' ' + (isActive ? classes.lineActive : '')
            }
          >
            <Link href="/admin/[[...slug]]" as={`/admin/${href}`}>
              <a className={classes.line}>{label}</a>
            </Link>
            {isActive && <div className={classes.indicatorLineActive} />}
          </div>
        )}
        {!!menuChildren && (
          <button
            className={classes.line + ' ' + classes.lineHover}
            style={{ transition: 'all 500ms', position: 'relative' }}
            onClick={toggleChild}
          >
            {label}
            <IonIcon
              name="chevron-down"
              style={
                childState
                  ? { transform: 'rotate(-180deg)', transition: 'all 500ms' }
                  : { transition: 'all 500ms' }
              }
            />
            {!childState && isBoosts ? (
              <div
                className={
                  classes.indicatorLineActive + ' ' + classes.opacityFullDeux
                }
                style={{ height: '32px' }}
              />
            ) : (
              ''
            )}
          </button>
        )}
      </div>
      {!!menuChildren && (
        <Collapse className={classes.children} in={childState}>
          {menuChildren.map((item, index) => (
            <MenuItem
              key={`${index}-${item.code}`}
              childrenState={childrenState}
              code={item.code}
              href={slugify(item.code, 2)}
              isActive={words.join('_') === item.code}
              label={item.label}
              onToggle={onToggle}
              sidebarStateTimeout={sidebarStateTimeout}
              words={words}
            />
          ))}
        </Collapse>
      )}
    </div>
  )
}

export default MenuItem
