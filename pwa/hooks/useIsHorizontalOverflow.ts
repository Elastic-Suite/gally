import { useState, useLayoutEffect } from 'react'
import { IHorizontalOverflow } from '~/types'

export const useIsHorizontalOverflow = (ref) => {
  const [isOverflow, setIsOverflow] = useState(undefined)
  const [shadow, setShadow] = useState(false)

  useLayoutEffect(() => {
    const { current } = ref

    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth
      setIsOverflow(hasOverflow)
      if (hasOverflow) {
        current.addEventListener('scroll', (event) => {
          setShadow(event.srcElement.scrollLeft > 0)
        })
      }
    }

    trigger()
  }, [ref])

  const result: IHorizontalOverflow = { isOverflow, shadow }

  return result
}
