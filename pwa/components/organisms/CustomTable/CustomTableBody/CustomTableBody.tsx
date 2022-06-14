import { ChangeEvent } from 'react'
import { Checkbox, Switch, TableBody, TableCell, TableRow } from '@mui/material'
import { StickyTableCell } from '~/components/organisms/CustomTable/CustomTable.styled'
import { DataContentType, ITableCell, ITableRow } from '~/types/customTables'

interface IProps {
  tableRows: ITableRow[]
  selectedRows?: string[]
  setSelectedRows?: (arr: string[]) => void
}

const CustomTableBody = (props: IProps) => {
  const { tableRows, setSelectedRows, selectedRows } = props

  const rowDisplayAccordingToType = (cell: ITableCell) => {
    switch (cell.type) {
      case DataContentType.STRING:
        return cell.value
      case DataContentType.BOOLEAN:
        return <Switch defaultChecked={cell.value as boolean} />
    }
  }

  const handleSingleRow = (e: ChangeEvent<HTMLInputElement>, rowId: string) => {
    setSelectedRows(
      e.target.checked
        ? selectedRows.concat(rowId)
        : selectedRows.filter((value) => value !== rowId)
    )
  }

  return (
    <TableBody>
      {tableRows.map((tableRow) => (
        <TableRow key={tableRow.id}>
          {selectedRows && (
            <StickyTableCell sx={{ backgroundColor: 'colors.white' }}>
              <Checkbox
                checked={selectedRows.includes(tableRow.id)}
                onChange={(value) => handleSingleRow(value, tableRow.id)}
              />
            </StickyTableCell>
          )}

          {tableRow.cells.map((cell) => (
            <TableCell sx={{ backgroundColor: 'colors.white' }} key={cell.id}>
              {rowDisplayAccordingToType(cell)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

export default CustomTableBody
