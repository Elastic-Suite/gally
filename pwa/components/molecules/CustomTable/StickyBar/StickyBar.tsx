import { MutableRefObject, ReactNode, useEffect, useRef } from 'react'
import { Box, styled } from '@mui/system'

import { selectSidebarState, useAppSelector } from '~/store'

const StickyContainer = styled(Box)({
  display: 'flex',
  position: 'fixed',
  bottom: '0',
  background:
    'linear-gradient(0deg, rgba(21, 26, 71, 0.1) 0%, rgba(21, 26, 71, 0) 110.27%)',
  zIndex: '2',
  height: '112px',
  width: '100%',
})

const StickyActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.colors.white,
  minHeight: '64px',
  width: '100%',
  margin: '32px 16px 16px 16px',
  border: 'solid',
  borderColor: theme.palette.colors.neutral[300],
  borderWidth: '1px',
  boxShadow:
    '0px -8px 8px rgba(226, 230, 243, 0.2), 0px 8px 8px rgba(107, 113, 166, 0.2), 4px 4px 14px rgba(226, 230, 243, 0.5)',
  borderRadius: '8px',
  alignItems: 'center',
  boxSizing: 'border-box',
  padding: `${theme.spacing(1.5)} ${theme.spacing(4)}`,
}))

function getStickyBarStyles(positionRef?: MutableRefObject<HTMLDivElement>): {
  left: string
  width: string
} {
  let left = 0
  let width = ''
  if (positionRef?.current) {
    const positions = positionRef.current.getBoundingClientRect()
    left = positions.left - 32
    width = `${positions.width + 64}px`
  }
  return { left: `${left}px`, width }
}

interface IProps {
  children: ReactNode
  show: boolean
  positionRef?: MutableRefObject<HTMLDivElement>
}

function StickyBar(props: IProps): JSX.Element {
  const { children, positionRef, show } = props
  const ref = useRef<HTMLDivElement>()

  const sidebarState = useAppSelector(selectSidebarState)

  // Recalculate styles when the sidebar is opened or closed
  useEffect(() => {
    if (ref.current) {
      const { left, width } = getStickyBarStyles(positionRef)
      ref.current.style.left = left
      ref.current.style.width = width
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionRef, sidebarState]) // The additionnal dependency is needed here

  // Recalculate styles when the window is resized
  useEffect(() => {
    function handleResize(): void {
      if (ref.current) {
        const { left, width } = getStickyBarStyles(positionRef)
        ref.current.style.left = left
        ref.current.style.width = width
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [positionRef])

  if (!show) {
    return null
  }

  return (
    <StickyContainer
      data-testid="sticky-bar"
      ref={ref}
      style={getStickyBarStyles(positionRef)}
    >
      <StickyActions>{children}</StickyActions>
    </StickyContainer>
  )
}

export default StickyBar
