import { TableBody } from '@mui/material'

import { ITableHeader, ITableRow } from '~/types/customTables'
import NonDraggableRow from '../CustomTableRow/NonDraggableRow'

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
    paginated,
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
          paginated={paginated}
        />
      ))}
    </TableBody>
  )
}

export default NonDraggableBody
