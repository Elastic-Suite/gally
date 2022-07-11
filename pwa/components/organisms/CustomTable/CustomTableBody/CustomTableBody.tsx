import { ChangeEvent } from 'react'
import { Checkbox, Switch, TableBody, TableCell, TableRow } from '@mui/material'
import { StickyTableCell } from '~/components/organisms/CustomTable/CustomTable.styled'
import { DataContentType, ITableHeader, ITableRow } from '~/types/customTables'

interface IProps {
  tableRows: ITableRow[]
  tableHeaders: ITableHeader[]
  selectedRows?: string[]
  setSelectedRows?: (arr: string[]) => void
}

function CustomTableBody(props: IProps): JSX.Element {
  const { tableRows, tableHeaders, setSelectedRows, selectedRows } = props

  function rowDisplayAccordingToType(
    header: ITableHeader,
    row: ITableRow
  ): JSX.Element | string | boolean | number {
    switch (header.type) {
      case DataContentType.STRING:
        return row[header.field]
      case DataContentType.BOOLEAN:
        return <Switch defaultChecked={row[header.field] as boolean} />
    }
  }

  function handleSingleRow(checked: boolean, rowId: string): void {
    setSelectedRows(
      checked
        ? selectedRows.concat(rowId)
        : selectedRows.filter((value) => value !== rowId)
    )
  }

  return (
    <TableBody>
      {tableRows.map((tableRow) => (
        <TableRow key={tableRow.id}>
          {selectedRows ? (
            <StickyTableCell sx={{ backgroundColor: 'colors.white' }}>
              <Checkbox
                checked={selectedRows.includes(tableRow.id)}
                onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                  handleSingleRow(event.target.checked, tableRow.id)
                }
              />
            </StickyTableCell>
          ) : null}

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
