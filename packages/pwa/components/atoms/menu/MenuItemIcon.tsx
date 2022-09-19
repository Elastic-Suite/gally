import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import Link from 'next/link'
import { keyframes, styled } from '@mui/system'

const CustomIndicatorLineActiveTwo = styled('div')(({ theme }) => ({
  width: 3,
  background: theme.palette.menu.active,
  boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
  borderRadius: '5px 0px 0px 5px',
}))

const CustomRoot = styled('a')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  textDecoration: 'unset',
  color: 'inherit',
  padding: theme.spacing(1),
  '& ion-icon': {
    color: theme.palette.menu.text500,
  },
}))

const CustomIndicatorLineActive = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: 0,
  width: 3,
  height: '32px',
  background: theme.palette.menu.active,
  boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
  borderRadius: '5px 0px 0px 5px',
}))

const customNoChildHoverProps = ['sidebarState']
const CustomNoChildHover = styled(CustomRoot, {
  shouldForwardProp: (prop: string) => !customNoChildHoverProps.includes(prop),
})<{ sidebarState: boolean }>(({ theme, sidebarState }) => ({
  width: sidebarState ? '100%' : 'fit-content',
  '&:hover': {
    background: theme.palette.menu.hover,
    borderRadius: 8,
  },
  gap: sidebarState ? theme.spacing(2) : 0,
  marginRight: sidebarState && theme.spacing(2),
}))

const opacityFullDeux = keyframes`
  0% { opacity: 0 },
  45% { opacity: 0 },
  100% { opacity: 1 },
`

const opacityFull = keyframes`
  from { opacity: 0 },
  to { opacity: 1 },
`

const CustomSpan = styled('span')({ opacity: 1, transition: 'all 500ms' })

const CustomOpacityFull = styled(CustomSpan)({
  opacity: 0,
  animation: `${opacityFull} 1000ms forwards`,
})

const heightZero = keyframes`
  0% {
    height: 'auto';
    width: 'auto';
    opacity: 1;
    position: 'relative';
  },
  20% {
    height: 'auto';
    width: 'auto';
    opacity: 0;
    position: 'relative';
  },
  100% { height: 0; width: 0; opacity: 0; position: 'absolute' },
`

const CustomHeightZero = styled(CustomSpan)({
  opacity: 1,
  height: 'auto',
  width: 'auto',
  animation: `${heightZero} 1400ms forwards`,
  position: 'relative',
})

const CustomIndicatorLineActiveOpacityFullDeux = styled(
  CustomIndicatorLineActive
)({
  opacity: 0,
  animation: `${opacityFullDeux} 1200ms forwards`,
})

const CustomIndicatorLineActiveTwoOpacityFullDeux = styled(
  CustomIndicatorLineActive
)({
  opacity: 0,
  animation: `${opacityFullDeux} 1200ms forwards`,
})

const customClassNameStyleRootProps = ['lightStyle']
const CustomClassNameStyleRoot = styled('div', {
  shouldForwardProp: (prop: string) =>
    !customClassNameStyleRootProps.includes(prop),
})<{ lightStyle?: boolean }>(({ theme, lightStyle }) => ({
  fontFamily: 'inter',
  fontWeight: lightStyle ? 600 : 500,
  fontSize: lightStyle ? 13 : 14,
  lineHeight: '20px',
  letterSpacing: lightStyle ? 0.5 : 'initial',
  textTransform: lightStyle ? 'uppercase' : 'initial',
  color: lightStyle ? theme.palette.menu.text600 : theme.palette.menu.text500,
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
  textDecoration: 'unset',
  padding: theme.spacing(1),
  '& ion-icon': {
    color: theme.palette.menu.text500,
  },
}))

const customClassNameStyleProps = ['lightStyle', 'isActive']
const CustomClassNameStyle = styled('div', {
  shouldForwardProp: (prop: string) =>
    !customClassNameStyleProps.includes(prop),
})<{
  isActive: boolean
  lightStyle?: boolean
}>(({ theme, lightStyle, isActive }) => ({
  display: 'flex',
  fontFamily: 'inter',
  fontWeight: lightStyle ? 600 : 500,
  fontSize: lightStyle ? 13 : 14,
  lineHeight: '20px',
  letterSpacing: lightStyle ? 0.5 : 'initial',
  textTransform: lightStyle ? 'uppercase' : 'initial',
  color: isActive
    ? theme.palette.colors.secondary['600']
    : lightStyle
    ? theme.palette.menu.text600
    : theme.palette.menu.text500,
  '&:hover': {
    cursor: 'pointer',
  },
  justifyContent: isActive && 'space-between',
}))

interface IProps {
  childPadding?: boolean
  code: string
  href: string
  isActive?: boolean
  isRoot?: boolean
  label: string
  lightStyle?: boolean
  sidebarState?: boolean
  sidebarStateTimeout?: boolean
}

function MenuItemIcon(props: IProps): JSX.Element {
  const {
    childPadding,
    code,
    href,
    isActive,
    isRoot,
    label,
    lightStyle,
    sidebarState,
    sidebarStateTimeout,
  } = props

  const Label = !sidebarStateTimeout ? CustomOpacityFull : CustomHeightZero
  const IndicatorLineActive = sidebarStateTimeout
    ? CustomIndicatorLineActiveTwoOpacityFullDeux
    : CustomIndicatorLineActiveTwo

  /*
   * Verification and return of specific data if the item has children
   */
  if (childPadding) {
    return (
      <CustomClassNameStyleRoot lightStyle={!lightStyle}>
        <IonIcon
          name={code}
          style={{
            width: 18,
            height: 18,
            color: isRoot && sidebarStateTimeout && '#2C19CD',
          }}
        />
        {Boolean(sidebarStateTimeout && isRoot) && (
          <CustomIndicatorLineActiveOpacityFullDeux />
        )}

        <Label>{label}</Label>
      </CustomClassNameStyleRoot>
    )
  }
  return (
    <CustomClassNameStyle lightStyle={!lightStyle} isActive={isActive}>
      <Link href={`/admin/${href}`} passHref>
        <CustomNoChildHover sidebarState={sidebarState}>
          <IonIcon
            name={code}
            style={{
              width: 18,
              height: 18,
              color: isActive ? '#2C19CD' : '',
            }}
          />

          <Label>{label}</Label>
        </CustomNoChildHover>
      </Link>
      {isActive ? <IndicatorLineActive /> : null}
    </CustomClassNameStyle>
  )
}

export default MenuItemIcon
