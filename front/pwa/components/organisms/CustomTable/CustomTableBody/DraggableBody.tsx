import { FunctionComponent } from 'react'
import { TableBody } from '@mui/material'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import { IFieldGuesserProps, ITableHeader, ITableRow } from 'shared'

import DraggableRow from '../CustomTableRow/DraggableRow'

interface IProps {
  Field: FunctionComponent<IFieldGuesserProps>
  cssLeftValues: number[]
  isHorizontalOverflow: boolean
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string
  ) => void
  onSelectRows: (arr: (string | number)[]) => void
  selectedRows: (string | number)[]
  shadow: boolean
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  withSelection: boolean
}

function DraggableBody(props: IProps): JSX.Element {
  const {
    Field,
    cssLeftValues,
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
                  Field={Field}
                  tableRow={tableRow}
                  onRowUpdate={onRowUpdate}
                  tableHeaders={tableHeaders}
                  selectedRows={selectedRows}
                  onSelectRows={onSelectRows}
                  provider={provider}
                  withSelection={withSelection}
                  cssLeftValuesIterator={cssLeftValues.entries()}
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
