import { ChangeEvent } from 'react'
import { Checkbox, Switch, TableBody, TableCell, TableRow } from '@mui/material'
import { StickyTableCell } from '~/components/organisms/CustomTable/CustomTable.styled'
import { DataContentType, ITableRow, ITableHeader } from '~/types/customTables'

interface IProps {
  tableRows: ITableRow[]
  tableHeaders: ITableHeader[]
  selectedRows?: string[]
  setSelectedRows?: (arr: string[]) => void
}

const CustomTableBody = (props: IProps) => {
  const { tableRows, tableHeaders, setSelectedRows, selectedRows } = props

  const rowDisplayAccordingToType = (header: ITableHeader, row: ITableRow) => {
    switch (header.type) {
      case DataContentType.STRING:
        return row[header.field]
      case DataContentType.BOOLEAN:
        return <Switch defaultChecked={row[header.field] as boolean} />
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

          {tableHeaders.map((header) => (
            <TableCell
              sx={{ backgroundColor: 'colors.white' }}
              key={header.field}
            >
              {rowDisplayAccordingToType(header, tableRow)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

export default CustomTableBody
