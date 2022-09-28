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
  prevRows?: ITableRow[]
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
    prevRows,
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
                  cssLeftValuesIterator={cssLeftValues.entries()}
                  isHorizontalOverflow={isHorizontalOverflow}
                  onRowUpdate={onRowUpdate}
                  onSelectRows={onSelectRows}
                  prevRow={prevRows?.[index]}
                  provider={provider}
                  selectedRows={selectedRows}
                  shadow={shadow}
                  tableHeaders={tableHeaders}
                  tableRow={tableRow}
                  withSelection={withSelection}
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
