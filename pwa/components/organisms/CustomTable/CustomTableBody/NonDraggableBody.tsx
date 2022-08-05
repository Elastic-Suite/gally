import { TableBody } from '@mui/material'

import { ITableHeader, ITableRow } from '~/types/customTables'
import NonDraggableRow from '../CustomTableRow/NonDraggableRow'

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

function NonDraggableBody(props: IProps): JSX.Element {
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
    <TableBody>
      {tableRows.map((tableRow) => (
        <NonDraggableRow
          key={tableRow.id}
          tableRow={tableRow}
          onRowUpdate={onRowUpdate}
          tableHeaders={tableHeaders}
          withSelection={withSelection}
          selectedRows={selectedRows}
          onSelectRows={onSelectRows}
          cSSLeftValuesIterator={cSSLeftValues.entries()}
          isHorizontalOverflow={isHorizontalOverflow}
          shadow={shadow}
        />
      ))}
    </TableBody>
  )
}

export default NonDraggableBody
