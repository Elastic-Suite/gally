import { TableBody } from '@mui/material'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { ITableHeader, ITableRow } from '~/types/customTables'
import DraggableRow from '../CustomTableRow/DraggableRow'

interface IProps {
  cSSLeftValues: number[]
  isHorizontalOverflow: boolean
  onRowUpdate?: (row: ITableRow) => void
  onSelectRows: (arr: (string | number)[]) => void
  selectedRows: (string | number)[]
  shadow: boolean
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  withSelection: boolean
}

function DraggableBody(props: IProps): JSX.Element {
  const {
    cSSLeftValues,
    isHorizontalOverflow,
    onRowUpdate,
    onSelectRows,
    selectedRows,
    shadow,
    tableHeaders,
    tableRows,
    withSelection,
  } = props

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
                  onRowUpdate={onRowUpdate}
                  tableHeaders={tableHeaders}
                  selectedRows={selectedRows}
                  onSelectRows={onSelectRows}
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
