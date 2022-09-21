import { FunctionComponent } from 'react'
import { TableBody } from '@mui/material'

import { IFieldGuesserProps, ITableHeader, ITableRow } from 'shared'
import NonDraggableRow from '../CustomTableRow/NonDraggableRow'

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

function NonDraggableBody(props: IProps): JSX.Element {
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
    <TableBody>
      {tableRows.map((tableRow) => (
        <NonDraggableRow
          Field={Field}
          key={tableRow.id}
          tableRow={tableRow}
          onRowUpdate={onRowUpdate}
          tableHeaders={tableHeaders}
          withSelection={withSelection}
          selectedRows={selectedRows}
          onSelectRows={onSelectRows}
          cssLeftValuesIterator={cssLeftValues.entries()}
          isHorizontalOverflow={isHorizontalOverflow}
          shadow={shadow}
        />
      ))}
    </TableBody>
  )
}

export default NonDraggableBody
