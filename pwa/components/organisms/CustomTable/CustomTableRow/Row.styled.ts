import { reorderingColumnWidth, stickyColunWidth } from '~/constants'
import { DataContentType } from '~/types'
import { stickyBorderStyle } from '../CustomTable.styled'

export const draggableColumnStyle = (
  isOnlyDraggable: boolean,
  leftValue: string,
  isHorizontalOverflow: boolean,
  shadow: boolean
) => {
  return {
    minWidth: `${reorderingColumnWidth}px`,
    ...(!isOnlyDraggable && { borderRight: 'none' }),
    ...(isOnlyDraggable &&
      isHorizontalOverflow && { ...stickyBorderStyle(shadow) }),
    backgroundColor: 'colors.white',
    '&:hover': {
      color: 'colors.neutral.500',
      cursor: 'default',
    },
    zIndex: '1',
    left: `${leftValue}px`,
  }
}

export const reorderIconStyle = {
  fontSize: 'x-large',
  position: 'absolute',
  left: '18.75%',
  right: '18.75%',
  top: '36.33%',
  bottom: '36.33%',
  color: 'colors.white',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    color: 'colors.neutral.500',
    cursor: 'grab',
  },
}

export const stickyStyle = (
  leftValue: string,
  shadow: boolean,
  isLastSticky: boolean,
  type: DataContentType
) => {
  return {
    zIndex: '1',
    minWidth: `${stickyColunWidth}px`,
    left: `${leftValue}px`,
    backgroundColor: 'colors.white',
    ...(isLastSticky && { ...stickyBorderStyle(shadow) }),
    ...(type === DataContentType.DROPDOWN && { overflow: 'visible' }),
  }
}

export const selectionStyle = (
  isHorizontalOverflow: boolean,
  leftValue: string,
  shadow: boolean,
  stickyColumnCount: number
) => {
  return {
    left: `${leftValue}px`,
    backgroundColor: 'colors.white',
    zIndex: '1',
    ...(isHorizontalOverflow &&
      stickyColumnCount === 0 && { ...stickyBorderStyle(shadow) }),
  }
}

export const nonStickyStyle = (type: DataContentType) => {
  return {
    backgroundColor: 'colors.white',
    ...(type === DataContentType.DROPDOWN && { overflow: 'visible' }),
  }
}
