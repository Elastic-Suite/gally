import { ChangeEvent } from 'react'
import { Checkbox, TableRow } from '@mui/material'
import {
  BaseTableCell,
  StickyTableCell,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import {
  ITableHeader,
  ITableHeaderSticky,
  ITableRow,
} from '~/types/customTables'
import { handleSingleRow, manageStickyHeaders } from '../CustomTable.service'
import EditableContent from '../CustomTableCell/EditableContent'
import NonEditableContent from '../CustomTableCell/NonEditableContent'
import {
  draggableColumnStyle,
  nonStickyStyle,
  selectionStyle,
  stickyStyle,
} from './Row.service'

interface IProps {
  tableRow: ITableRow
  onRowUpdate?: (
    id: string | number,
    field: string,
    value: boolean | number | string
  ) => void
  tableHeaders: ITableHeader[]
  withSelection: boolean
  selectedRows: (string | number)[]
  onSelectRows: (arr: (string | number)[]) => void
  cSSLeftValuesIterator: IterableIterator<[number, number]>
  isHorizontalOverflow: boolean
  shadow: boolean
  paginated: boolean
}

function NonDraggableRow(props: IProps): JSX.Element {
  const {
    tableRow,
    onRowUpdate,
    tableHeaders,
    selectedRows,
    onSelectRows,
    withSelection,
    cSSLeftValuesIterator,
    isHorizontalOverflow,
    shadow,
    paginated,
  } = props

  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const nonStickyHeaders = tableHeaders.filter((header) => !header.sticky)
  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0

  return (
    <TableRow
      key={tableRow.id}
      sx={{
        '&:last-of-type': {
          'td:first-of-type': {
            ...(!paginated && { borderRadius: '0 0 0 8px' }),
          },
          'td:last-of-type': {
            ...(!paginated && { borderRadius: '0 0 8px 0' }),
          },
        },
      }}
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
      />

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
            data-testid="non-draggable-single-row-selection"
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

export default NonDraggableRow
