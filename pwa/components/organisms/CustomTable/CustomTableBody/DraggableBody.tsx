import { TableBody } from '@mui/material'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { ITableHeader, ITableRow } from '~/types/customTables'
import DraggableRow from '../CustomTableRow/DraggableRow'

interface IProps {
  cSSLeftValues: number[]
  isHorizontalOverflow: boolean
  onRowUpdate?: (
    id: string | number,
    field: string,
    value: boolean | number | string
  ) => void
  onSelectRows: (arr: (string | number)[]) => void
  selectedRows: (string | number)[]
  shadow: boolean
<<<<<<< HEAD
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  withSelection: boolean
=======
  paginated: boolean
>>>>>>> feat/ESPP-279-gql-fetch
}

function DraggableBody(props: IProps): JSX.Element {
  const {
    cSSLeftValues,
    isHorizontalOverflow,
    onRowUpdate,
    onSelectRows,
    selectedRows,
    shadow,
<<<<<<< HEAD
    tableHeaders,
    tableRows,
    withSelection,
=======
    paginated,
>>>>>>> feat/ESPP-279-gql-fetch
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
                  paginated={paginated}
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
