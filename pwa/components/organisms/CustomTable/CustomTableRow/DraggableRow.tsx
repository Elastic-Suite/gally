import { Box, Checkbox, TableRow } from '@mui/material'
import { useContext } from 'react'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import {
  BaseTableCell,
  StickyTableCell,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import { handleSingleRow } from '../CustomTable.service'
import { DraggableContext } from '../CustomTableBody/DraggableBody'
import EditableContent from '../CustomTableCell/EditableContent'
import NonEditableContent from '../CustomTableCell/NonEditableContent'
import {
  draggableColumnStyle,
  nonStickyStyle,
  reorderIconStyle,
  selectionStyle,
  stickyStyle,
} from './Row.styled'

const DraggableRow = () => {
  const {
    tableRow,
    updateRow,
    selectedRows,
    setSelectedRows,
    provider,
    stickyHeaders,
    nonStickyHeaders,
    withSelection,
    cSSLeftValues,
    isHorizontalOverflow,
    shadow,
  } = useContext(DraggableContext)

  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0

  const CSSLeftValuesIterator = cSSLeftValues.entries()

  return (
    <TableRow
      key={tableRow.id}
      {...provider.draggableProps}
      ref={provider.innerRef}
    >
      <StickyTableCell
        sx={draggableColumnStyle(
          isOnlyDraggable,
          CSSLeftValuesIterator.next().value[1],
          isHorizontalOverflow,
          shadow
        )}
        {...provider.dragHandleProps}
      >
        <Box sx={reorderIconStyle}>
          <IonIcon name="reorder-two-outline"></IonIcon>
        </Box>
      </StickyTableCell>

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

export default DraggableRow
