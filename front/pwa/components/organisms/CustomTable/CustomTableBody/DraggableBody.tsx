import { FunctionComponent, SyntheticEvent } from 'react'
import { TableBody } from '@mui/material'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import {
  IConfigurations,
  IFieldGuesserProps,
  ITableConfig,
  ITableHeader,
  ITableRow,
} from 'shared'

import DraggableRow from '../CustomTableRow/DraggableRow'

interface IProps {
  Field: FunctionComponent<IFieldGuesserProps>
  cssLeftValues: number[]
  diffRows?: ITableRow[]
  isHorizontalOverflow: boolean
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ) => void
  onSelectRows: (arr: (string | number)[]) => void
  selectedRows: (string | number)[]
  shadow: boolean
  tableConfigs?: ITableConfig[]
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  withSelection: boolean
  configuration: IConfigurations
}

function DraggableBody(props: IProps): JSX.Element {
  const {
    Field,
    cssLeftValues,
    diffRows,
    isHorizontalOverflow,
    onRowUpdate,
    onSelectRows,
    selectedRows,
    shadow,
    tableConfigs,
    tableHeaders,
    tableRows,
    withSelection,
    configuration,
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
                  cssLeftValues={cssLeftValues}
                  isHorizontalOverflow={isHorizontalOverflow}
                  onRowUpdate={onRowUpdate}
                  onSelectRows={onSelectRows}
                  diffRow={diffRows?.[index]}
                  provider={provider}
                  selectedRows={selectedRows}
                  shadow={shadow}
                  tableConfig={tableConfigs?.[index]}
                  tableHeaders={tableHeaders}
                  tableRow={tableRow}
                  withSelection={withSelection}
                  configuration={configuration}
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
