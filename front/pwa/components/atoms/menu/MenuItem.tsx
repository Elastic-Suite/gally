import { Collapse } from '@mui/material'
import Link from 'next/link'
import { keyframes, styled } from '@mui/system'
import { IMenuChild } from 'shared'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

/*
 * Create function to create path from code of the menu item
 */
function slugify(code: string, depth: number): string {
  let slug = code
  for (let i = 0; i < depth; i++) {
    slug = slug.replace('_', '/')
  }
  return slug
}

const CustomRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  opacity: 1,
  transition: 'all 500ms',
})

const CustomLineAHref = styled('a')(({ theme }) => ({
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
}))

const CustomLineButton = styled('button')(({ theme }) => ({
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
  width: '100%',
  border: 0,
  '&:hover': {
    background: theme.palette.menu.hover,
    borderRadius: 8,
  },
}))

const CustomLineHover = styled('div')(({ theme }) => ({
  '&:hover': {
    background: theme.palette.menu.hover,
    borderRadius: 8,
  },
}))

const CustomLinePadding = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  color: theme.palette.menu.text500,
}))

const CustomChildren = styled(Collapse)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: theme.spacing(2),
  transition: 'all 1000ms',
}))

const CustomLineActive = styled(CustomLineHover)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  color: theme.palette.menu.active,
}))

const CustomIndicatorLineActive = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(-2),
  top: 0,
  height: '100%',
  width: 3,
  background: theme.palette.menu.active,
  boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
  borderRadius: '5px 0px 0px 5px',
}))

const customIndicatorLineActiveTwo = keyframes`
  0% {
    opacity:0
  }

  100% {
    opacity:1
  }
`

const CustomIndicatorLineActiveTwo = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(-2),
  top: 0,
  opacity: 0,
  animation: `${customIndicatorLineActiveTwo} 2500ms forwards`,
  height: '100%',
  width: 3,
  background: theme.palette.menu.active,
  boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
  borderRadius: '5px 0px 0px 5px',
}))

const heightZero = keyframes`
  0% {
    height: 'auto';
    opacity: 1
  },

  20% {
    height: 'auto';
    opacity: 0
  },

  100% {
    height: 0;
    opacity: 0
  },
`

const CustomHeightZero = styled('div')({
  opacity: 1,
  height: 'auto',
  animation: `${heightZero} 2000ms forwards`,
})

const opacityFull = keyframes`
  from {
    opacity: 0
  },

  to {
    opacity: 1
  },
`

const CustomOpacityFull = styled('div')({
  opacity: 0,
  animation: `${opacityFull} 1000ms forwards`,
})

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

function MenuItem(props: IProps): JSX.Element {
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

  function toggleChild(): void {
    onToggle(code, !childState)
  }

  const Root = !sidebarStateTimeout ? CustomOpacityFull : CustomHeightZero

  const Line = isActive ? CustomLineActive : CustomLineHover
  return (
    <CustomRoot>
      <Root>
        <CustomLinePadding style={{ position: 'relative' }}>
          {!menuChildren && (
            <Line>
              <Link href={`/admin/${href}`} passHref>
                <CustomLineAHref>{label}</CustomLineAHref>
              </Link>
              {isActive ? <CustomIndicatorLineActive /> : null}
            </Line>
          )}
          {Boolean(menuChildren) && (
            <CustomLineButton
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
            </CustomLineButton>
          )}
          {!childState && isBoosts ? <CustomIndicatorLineActiveTwo /> : null}
        </CustomLinePadding>
        {Boolean(menuChildren) && (
          <CustomChildren in={childState}>
            {menuChildren.map((item: IMenuChild) => (
              <MenuItem
                key={item.code}
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
          </CustomChildren>
        )}
      </Root>
    </CustomRoot>
  )
}

export default MenuItem
