import {
  DataContentType,
  IDraggableColumnStyle,
  IStickyStyle,
  reorderingColumnWidth,
  stickyColunWidth,
} from 'shared'
import {
  draggableColumnStyle,
  nonStickyStyle,
  selectionStyle,
  stickyStyle,
} from './Row.service'
import { stickyBorderStyle } from '../CustomTable.service'

jest.mock('~/components/organisms/CustomTable/CustomTable.service')

describe('RowService', () => {
  describe('draggableColumnStyle', () => {
    it('Should not apply border-right if not only draggable', () => {
      const mockInput = {
        isOnlyDraggable: false,
        leftValue: '10',
        isHorizontalOverflow: true,
        shadow: true,
      }
      const cssStyle: IDraggableColumnStyle = draggableColumnStyle(
        mockInput.isOnlyDraggable,
        mockInput.leftValue,
        mockInput.isHorizontalOverflow,
        mockInput.shadow
      )
      expect(cssStyle.borderRight).toEqual('none')
      expect(cssStyle.minWidth).toEqual(`${reorderingColumnWidth}px`)
    })

    it('Should use stickyBorderStyle', () => {
      const mockInput2 = {
        isOnlyDraggable: true,
        leftValue: '10',
        isHorizontalOverflow: true,
        shadow: false,
      }
      const cssStyle: IDraggableColumnStyle = draggableColumnStyle(
        mockInput2.isOnlyDraggable,
        mockInput2.leftValue,
        mockInput2.isHorizontalOverflow,
        mockInput2.shadow
      )
      expect(stickyBorderStyle).toHaveBeenCalledWith(mockInput2.shadow)
      expect(cssStyle.left).toEqual('10px')
    })
  })

  describe('stickyStyle', () => {
    it('Should set sticky style if last sticky', () => {
      const mockInput = {
        leftValue: '10',
        shadow: false,
        isLastSticky: true,
        type: DataContentType.DROPDOWN,
      }
      const cssStyle: IStickyStyle = stickyStyle(
        mockInput.leftValue,
        mockInput.shadow,
        mockInput.isLastSticky,
        mockInput.type
      )
      expect(stickyBorderStyle).toHaveBeenCalledWith(mockInput.shadow)
      expect(cssStyle.overflow).toEqual('visible')
    })

    it('Should set sticky style if not last sticky', () => {
      const mockInput = {
        leftValue: '10',
        shadow: false,
        isLastSticky: true,
        type: DataContentType.LABEL,
      }
      const cssStyle: IStickyStyle = stickyStyle(
        mockInput.leftValue,
        mockInput.shadow,
        mockInput.isLastSticky,
        mockInput.type
      )
      expect(cssStyle.overflow).toBeUndefined()
      expect(cssStyle.minWidth).toEqual(`${stickyColunWidth}px`)
      expect(cssStyle.left).toEqual('10px')
    })
  })

  describe('selectionStyle', () => {
    it('Should set selection style with sticky border style', () => {
      const mockInput = {
        isHorizontalOverflow: true,
        leftValue: '10',
        shadow: true,
        stickyColumnCount: 0,
      }
      const cssStyle = selectionStyle(
        mockInput.isHorizontalOverflow,
        mockInput.leftValue,
        mockInput.shadow,
        mockInput.stickyColumnCount
      )
      expect(stickyBorderStyle).toHaveBeenCalledWith(mockInput.shadow)
      expect(cssStyle.left).toEqual('10px')
    })
  })

  describe('nonStickyStyle', () => {
    it('Should set overflow visible', () => {
      const cssStyle = nonStickyStyle(DataContentType.DROPDOWN)
      expect(cssStyle.overflow).toEqual('visible')
    })
    it('Should set overflow not visible', () => {
      const cssStyle = nonStickyStyle(DataContentType.STRING)
      expect(cssStyle.overflow).toBeUndefined()
    })
  })
})
