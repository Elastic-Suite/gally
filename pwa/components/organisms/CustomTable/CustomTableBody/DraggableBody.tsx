import { TableBody } from '@mui/material'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { ITableHeader, ITableRow } from '~/types/customTables'
import DraggableRow from '../CustomTableRow/DraggableRow'

interface IProps {
  tableRows: ITableRow[]
  setTableRows: (arr: ITableRow[]) => void
  tableHeaders: ITableHeader[]
  withSelection: boolean
  selectedRows: (string | number)[]
  setSelectedRows: (arr: (string | number)[]) => void
  cSSLeftValues: number[]
  isHorizontalOverflow: boolean
  shadow: boolean
}

function DraggableBody(props: IProps): JSX.Element {
  const {
    tableRows,
    setTableRows,
    tableHeaders,
    withSelection,
    setSelectedRows,
    selectedRows,
    cSSLeftValues,
    isHorizontalOverflow,
    shadow,
  } = props

  function updateRow(currentRow: ITableRow): void {
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
    <Droppable droppableId="droppableTable">
      {(provider): JSX.Element => (
        <TableBody ref={provider.innerRef} {...provider.droppableProps}>
          {tableRows.map((tableRow, index) => (
            <Draggable
              key={tableRow.id}
              draggableId={String(tableRow.id)}
              index={index}
            >
              {(provider): JSX.Element => (
                <DraggableRow
                  tableRow={tableRow}
                  updateRow={updateRow}
                  tableHeaders={tableHeaders}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  provider={provider}
                  withSelection={withSelection}
                  cSSLeftValuesIterator={cSSLeftValues.entries()}
                  isHorizontalOverflow={isHorizontalOverflow}
                  shadow={shadow}
                />
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
