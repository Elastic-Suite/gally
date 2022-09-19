import { useLayoutEffect, useState } from 'react'
import { IHorizontalOverflow } from 'shared'

export const useIsHorizontalOverflow = (
  current: HTMLDivElement
): IHorizontalOverflow => {
  const [isOverflow, setIsOverflow] = useState(false)
  const [shadow, setShadow] = useState(false)

  useLayoutEffect(() => {
    function trigger(): () => void {
      if (current) {
        const hasOverflow = current.scrollWidth > current.clientWidth
        setIsOverflow(hasOverflow)
        if (hasOverflow) {
          const handleScroll = (event: UIEvent): void => {
            setShadow((event.target as HTMLTableElement).scrollLeft > 0)
          }
          current.addEventListener('scroll', handleScroll)
          return () => current.removeEventListener('scroll', handleScroll)
        }
      }
    }

    trigger()
  }, [current])

  return { isOverflow, shadow }
}
