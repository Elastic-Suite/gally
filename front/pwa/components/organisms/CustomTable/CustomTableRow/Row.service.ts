import {
  DataContentType,
  IDraggableColumnStyle,
  INonStickyStyle,
  ISelectionStyle,
  IStickyStyle,
  reorderingColumnWidth,
  stickyColunWidth,
} from 'shared'
import { stickyBorderStyle } from '../CustomTable.service'

export function draggableColumnStyle(
  isOnlyDraggable: boolean,
  leftValue: number,
  isHorizontalOverflow: boolean,
  shadow: boolean
): IDraggableColumnStyle {
  return {
    minWidth: `${reorderingColumnWidth}px`,
    ...(!isOnlyDraggable && { borderRight: 'none' }),
    ...(isOnlyDraggable && isHorizontalOverflow && stickyBorderStyle(shadow)),
    backgroundColor: 'colors.white',
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

export function stickyStyle(
  leftValue: number,
  shadow: boolean,
  isLastSticky: boolean,
  type: DataContentType
): IStickyStyle {
  return {
    zIndex: '1',
    minWidth: `${stickyColunWidth}px`,
    left: `${leftValue}px`,
    borderBottomColor: 'colors.neutral.300',
    backgroundColor: 'colors.white',
    ...(isLastSticky && stickyBorderStyle(shadow)),
    ...(type === DataContentType.SELECT && { overflow: 'visible' }),
  }
}

export function selectionStyle(
  isHorizontalOverflow: boolean,
  leftValue: number,
  shadow: boolean,
  stickyColumnCount: number
): ISelectionStyle {
  return {
    left: `${leftValue}px`,
    borderBottomColor: 'colors.neutral.300',
    backgroundColor: 'colors.white',
    zIndex: '1',
    ...(isHorizontalOverflow &&
      stickyColumnCount === 0 &&
      stickyBorderStyle(shadow)),
  }
}

export function nonStickyStyle(type: DataContentType): INonStickyStyle {
  return {
    backgroundColor: 'colors.white',
    borderBottomColor: 'colors.neutral.300',
    ...(type === DataContentType.SELECT && { overflow: 'visible' }),
  }
}
