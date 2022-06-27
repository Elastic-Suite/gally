import { createContext } from 'react'
import { TableBody } from '@mui/material'

import {
  ITableRow,
  ITableHeader,
  ITableHeaderSticky,
} from '~/types/customTables'
import { manageStickyHeaders } from '../CustomTable.service'

export const NonDraggableContext = createContext(null)

interface IProps {
  tableRows: ITableRow[]
  setTableRows: (arr: ITableRow[]) => void
  tableHeaders: ITableHeader[]
  withSelection: boolean
  selectedRows: string[]
  setSelectedRows: (arr: string[]) => void
  cSSLeftValues: number[]
  children: React.ReactElement
  isHorizontalOverflow: boolean
  shadow: boolean
}

const NonDraggableBody = (props: IProps) => {
  const {
    tableRows,
    setTableRows,
    tableHeaders,
    withSelection,
    setSelectedRows,
    selectedRows,
    cSSLeftValues,
    children,
    isHorizontalOverflow,
    shadow,
  } = props

  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const nonStickyHeaders = tableHeaders.filter((header) => !header.sticky)

  const updateRow = (currentRow: ITableRow) => {
    const updatedTableRows: ITableRow[] = []
    tableRows.forEach((tableRow) => {
      if (tableRow.id === currentRow.id) {
        updatedTableRows.push(currentRow)
      } else {
        updatedTableRows.push(tableRow)
      }
    })
    setTableRows(updatedTableRows)
  }

  return (
    <TableBody>
      {tableRows.map((tableRow) => (
        <NonDraggableContext.Provider
          key={tableRow.id}
          value={{
            tableRow,
            updateRow,
            setTableRows,
            selectedRows,
            setSelectedRows,
            stickyHeaders,
            nonStickyHeaders,
            withSelection,
            cSSLeftValues,
            isHorizontalOverflow,
            shadow,
          }}
        >
          {children}
        </NonDraggableContext.Provider>
      ))}
    </TableBody>
  )
}

export default NonDraggableBody
