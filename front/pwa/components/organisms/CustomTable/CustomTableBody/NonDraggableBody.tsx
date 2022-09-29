import { FunctionComponent } from 'react'
import { TableBody } from '@mui/material'

import { IFieldGuesserProps, ITableHeader, ITableRow } from 'shared'
import NonDraggableRow from '../CustomTableRow/NonDraggableRow'

interface IProps {
  Field: FunctionComponent<IFieldGuesserProps>
  cssLeftValues: number[]
  diffRows?: ITableRow[]
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

function NonDraggableBody(props: IProps): JSX.Element {
  const {
    Field,
    cssLeftValues,
    diffRows,
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
    <TableBody>
      {tableRows.map((tableRow, index) => (
        <NonDraggableRow
          Field={Field}
          cssLeftValuesIterator={cssLeftValues.entries()}
          diffRow={diffRows?.[index]}
          isHorizontalOverflow={isHorizontalOverflow}
          key={tableRow.id}
          onRowUpdate={onRowUpdate}
          onSelectRows={onSelectRows}
          selectedRows={selectedRows}
          shadow={shadow}
          tableHeaders={tableHeaders}
          tableRow={tableRow}
          withSelection={withSelection}
        />
      ))}
    </TableBody>
  )
}

export default NonDraggableBody
