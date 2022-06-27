import { TableBody } from '@mui/material'
import { createContext } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import {
  ITableHeader,
  ITableHeaderSticky,
  ITableRow,
} from '~/types/customTables'
import { manageStickyHeaders } from '../CustomTable.service'

export const DraggableContext = createContext(null)

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

const DraggableBody = (props: IProps) => {
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
    <Droppable droppableId="droppable">
      {(provider) => (
        <TableBody ref={provider.innerRef} {...provider.droppableProps}>
          {tableRows.map((tableRow, index) => (
            <Draggable
              key={tableRow.id}
              draggableId={tableRow.id}
              index={index}
            >
              {(provider) => (
                <DraggableContext.Provider
                  value={{
                    tableRow,
                    updateRow,
                    selectedRows,
                    setSelectedRows,
                    provider,
                    stickyHeaders,
                    nonStickyHeaders,
                    withSelection,
                    cSSLeftValues,
                    isHorizontalOverflow,
                    shadow,
                  }}
                >
                  {children}
                </DraggableContext.Provider>
              )}
            </Draggable>
          ))}
          {provider.placeholder}
        </TableBody>
      )}
    </Droppable>
  )
}

export default DraggableBody
