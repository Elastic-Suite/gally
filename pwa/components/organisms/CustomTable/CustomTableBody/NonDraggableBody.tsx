import { TableBody } from '@mui/material'

import { ITableHeader, ITableRow } from '~/types/customTables'
import NonDraggableRow from '../CustomTableRow/NonDraggableRow'

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

function NonDraggableBody(props: IProps): JSX.Element {
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

  const updateRow = (currentRow: ITableRow): void => {
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
    <TableBody>
      {tableRows.map((tableRow) => (
        <NonDraggableRow
          key={tableRow.id}
          tableRow={tableRow}
          updateRow={updateRow}
          tableHeaders={tableHeaders}
          withSelection={withSelection}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          cSSLeftValuesIterator={cSSLeftValues.entries()}
          isHorizontalOverflow={isHorizontalOverflow}
          shadow={shadow}
        />
      ))}
    </TableBody>
  )
}

export default NonDraggableBody
