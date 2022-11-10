import { styled } from '@mui/system'
import { ReactNode, useEffect, useRef } from 'react'

const Sentinel = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '64px',
})

const CustomRoot = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
})

const CustomLeftSide = styled('div')({
  width: 402,
  boxSizing: 'border-box',
  flexShrink: 0,
})

const CustomBorder = styled('div')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
}))

const Sticky = styled(CustomBorder)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.colors.white,
  position: 'sticky',
  top: '100px',
  alignSelf: 'flex-start',
  '&.fixed': {
    position: 'fixed',
  },
}))

const CustomRightSide = styled('div')({
  width: `calc(100% - 390px)`,
  boxSizing: 'border-box',
  paddingLeft: '25px',
})

interface IProps {
  left: ReactNode[] | ReactNode
  children: ReactNode
}

function TwoColsLayout({ left, children }: IProps): JSX.Element {
  const colRef = useRef<HTMLDivElement>()
  const sentinelRef = useRef<HTMLDivElement>()

  useEffect(() => {
    function handler(entries: IntersectionObserverEntry[]): void {
      if (!entries[0].isIntersecting) {
        colRef.current.classList.add('fixed')
      } else {
        colRef.current.classList.remove('fixed')
      }
    }

    if (typeof window !== 'undefined' && window.IntersectionObserver) {
      const observer = new window.IntersectionObserver(handler)
      observer.observe(sentinelRef.current)
      return () => observer.disconnect()
    }
  }, [])

  return (
    <>
      <Sentinel ref={sentinelRef} />
      <CustomRoot>
        <CustomLeftSide>
          <Sticky ref={colRef}>{left}</Sticky>
        </CustomLeftSide>
        <CustomRightSide>{children}</CustomRightSide>
      </CustomRoot>
    </>
  )
}

export default TwoColsLayout
