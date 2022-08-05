import { ChangeEvent } from 'react'
import { Box, Checkbox, TableRow } from '@mui/material'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import {
  BaseTableCell,
  StickyTableCell,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import { handleSingleRow, manageStickyHeaders } from '../CustomTable.service'
import {
  ITableHeader,
  ITableHeaderSticky,
  ITableRow,
} from '~/types/customTables'
import EditableContent from '../CustomTableCell/EditableContent'
import NonEditableContent from '../CustomTableCell/NonEditableContent'
import {
  draggableColumnStyle,
  nonStickyStyle,
  reorderIconStyle,
  selectionStyle,
  stickyStyle,
} from './Row.service'
import { DraggableProvided } from 'react-beautiful-dnd'

interface IProps {
  tableRow: ITableRow
  onRowUpdate?: (row: ITableRow) => void
  tableHeaders: ITableHeader[]
  withSelection: boolean
  selectedRows: (string | number)[]
  onSelectRows: (arr: (string | number)[]) => void
  provider: DraggableProvided
  cSSLeftValuesIterator: IterableIterator<[number, number]>
  isHorizontalOverflow: boolean
  shadow: boolean
}

function DraggableRow(props: IProps): JSX.Element {
  const {
    tableRow,
    onRowUpdate,
    tableHeaders,
    withSelection,
    selectedRows,
    onSelectRows,
    provider,
    cSSLeftValuesIterator,
    isHorizontalOverflow,
    shadow,
  } = props

  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const nonStickyHeaders = tableHeaders.filter((header) => !header.sticky)
  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0

  return (
    <TableRow
      key={tableRow.id}
      {...provider.draggableProps}
      ref={provider.innerRef}
    >
      <StickyTableCell
        sx={{
          borderBottomColor: 'colors.neutral.300',
          '&:hover': {
            color: 'colors.neutral.500',
            cursor: 'default',
          },
          ...draggableColumnStyle(
            isOnlyDraggable,
            cSSLeftValuesIterator.next().value[1],
            isHorizontalOverflow,
            shadow
          ),
        }}
        {...provider.dragHandleProps}
      >
        <Box sx={reorderIconStyle}>
          <IonIcon name="reorder-two-outline" />
        </Box>
      </StickyTableCell>

      {Boolean(withSelection) && (
        <StickyTableCell
          sx={selectionStyle(
            isHorizontalOverflow,
            cSSLeftValuesIterator.next().value[1],
            shadow,
            stickyHeaders.length
          )}
        >
          <Checkbox
            data-testid="draggable-single-row-selection"
            checked={selectedRows ? selectedRows.includes(tableRow.id) : false}
            onChange={(value: ChangeEvent<HTMLInputElement>): void =>
              handleSingleRow(value, tableRow.id, onSelectRows, selectedRows)
            }
          />
        </StickyTableCell>
      )}

      {stickyHeaders.map((stickyHeader) => (
        <StickyTableCell
          key={stickyHeader.field}
          sx={stickyStyle(
            cSSLeftValuesIterator.next().value[1],
            shadow,
            stickyHeader.isLastSticky,
            stickyHeader.type
          )}
        >
          {stickyHeader.editable ? (
            <EditableContent
              header={stickyHeader}
              row={tableRow}
              onRowUpdate={onRowUpdate}
            />
          ) : null}
          {!stickyHeader.editable && (
            <NonEditableContent header={stickyHeader} row={tableRow} />
          )}
        </StickyTableCell>
      ))}

      {nonStickyHeaders.map((header) => (
        <BaseTableCell sx={nonStickyStyle(header.type)} key={header.field}>
          {header.editable ? (
            <EditableContent
              header={header}
              row={tableRow}
              onRowUpdate={onRowUpdate}
            />
          ) : null}
          {!header.editable && (
            <NonEditableContent header={header} row={tableRow} />
          )}
        </BaseTableCell>
      ))}
    </TableRow>
  )
}

export default DraggableRow
