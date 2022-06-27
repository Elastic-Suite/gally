import { Checkbox, TableRow } from '@mui/material'
import { useContext } from 'react'
import {
  BaseTableCell,
  StickyTableCell,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import { handleSingleRow } from '../CustomTable.service'
import { NonDraggableContext } from '../CustomTableBody/NonDraggableBody'
import EditableContent from '../CustomTableCell/EditableContent'
import NonEditableContent from '../CustomTableCell/NonEditableContent'
import { nonStickyStyle, selectionStyle, stickyStyle } from './Row.styled'

const NonDraggableRow = () => {
  const {
    tableRow,
    updateRow,
    selectedRows,
    setSelectedRows,
    stickyHeaders,
    nonStickyHeaders,
    withSelection,
    cSSLeftValues,
    isHorizontalOverflow,
    shadow,
  } = useContext(NonDraggableContext)

  const CSSLeftValuesIterator = cSSLeftValues.entries()

  return (
    <TableRow key={tableRow.id}>
      {withSelection && (
        <StickyTableCell
          sx={selectionStyle(
            isHorizontalOverflow,
            CSSLeftValuesIterator.next().value[1],
            shadow,
            stickyHeaders.length
          )}
        >
          <Checkbox
            checked={selectedRows ? selectedRows.includes(tableRow.id) : false}
            onChange={(value) =>
              handleSingleRow(value, tableRow.id, setSelectedRows, selectedRows)
            }
          />
        </StickyTableCell>
      )}

      {stickyHeaders.map((stickyHeader) => (
        <StickyTableCell
          key={stickyHeader.field}
          sx={stickyStyle(
            CSSLeftValuesIterator.next().value[1],
            shadow,
            stickyHeader.isLastSticky,
            stickyHeader.type
          )}
        >
          {stickyHeader.editable && (
            <EditableContent
              header={stickyHeader}
              row={tableRow}
              onRowUpdate={updateRow}
            />
          )}
          {!stickyHeader.editable && (
            <NonEditableContent header={stickyHeader} row={tableRow} />
          )}
        </StickyTableCell>
      ))}

      {nonStickyHeaders.map((header) => (
        <BaseTableCell sx={nonStickyStyle(header.type)} key={header.field}>
          {header.editable && (
            <EditableContent
              header={header}
              row={tableRow}
              onRowUpdate={updateRow}
            />
          )}
          {!header.editable && (
            <NonEditableContent header={header} row={tableRow} />
          )}
        </BaseTableCell>
      ))}
    </TableRow>
  )
}

export default NonDraggableRow
