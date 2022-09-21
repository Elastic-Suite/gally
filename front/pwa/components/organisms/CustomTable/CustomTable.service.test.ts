import { DataContentType, ITableHeader, ITableHeaderSticky } from 'shared'
import { manageStickyHeaders, stickyBorderStyle } from './CustomTable.service'

describe('CustomTableService', () => {
  describe('manageStickyHeaders', () => {
    it('Should manage sticky headers', () => {
      const tableHeaders: ITableHeader[] = [
        {
          name: 'field1',
          label: 'Test header switch',
          type: DataContentType.BOOLEAN,
          editable: false,
          sticky: true,
        },
        {
          name: 'field2',
          label: 'Test header switch',
          type: DataContentType.BOOLEAN,
          editable: false,
          sticky: false,
        },
        {
          name: 'field3',
          label: 'Test header switch',
          type: DataContentType.BOOLEAN,
          editable: false,
          sticky: true,
        },
      ]
      const result: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
      expect(result).toEqual([
        {
          name: 'field1',
          label: 'Test header switch',
          type: DataContentType.BOOLEAN,
          editable: false,
          sticky: true,
          isLastSticky: false,
        },
        {
          name: 'field3',
          label: 'Test header switch',
          type: DataContentType.BOOLEAN,
          editable: false,
          sticky: true,
          isLastSticky: true,
        },
      ])
    })
  })

  describe('stickyBorderStyle', () => {
    it('Should generate sticky border style without shadow', () => {
      const shadow = false
      const result = stickyBorderStyle(shadow)
      expect(result.boxShadow).toBeUndefined()
    })

    it('Should generate sticky border style with shadow', () => {
      const shadow = true
      const result = stickyBorderStyle(shadow)
      expect(result.boxShadow).toBe('5px 0 460px -10px')
      expect(result.clipPath).toBe('inset(0px -15px 0px 0px)')
    })

    it('Should generate correct border-right', () => {
      const shadow = true
      const result = stickyBorderStyle(shadow)
      expect(result.borderRight).toBe('2px solid')
      expect(result.borderRightColor).toBe('colors.neutral.600')
    })
  })
})
