import { ChangeEvent, FunctionComponent, SyntheticEvent } from 'react'
import { Box, Checkbox, TableRow } from '@mui/material'
import { DraggableProvided } from 'react-beautiful-dnd'

import {
  IFieldGuesserProps,
  ITableConfig,
  ITableHeader,
  ITableHeaderSticky,
  ITableRow,
} from 'shared'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import {
  BaseTableCell,
  StickyTableCell,
} from '~/components/organisms/CustomTable/CustomTable.styled'

import { handleSingleRow, manageStickyHeaders } from '../CustomTable.service'

import {
  draggableColumnStyle,
  nonStickyStyle,
  reorderIconStyle,
  selectionStyle,
  stickyStyle,
} from './Row.service'

interface IProps {
  Field: FunctionComponent<IFieldGuesserProps>
  cssLeftValuesIterator: IterableIterator<[number, number]>
  diffRow?: ITableRow
  isHorizontalOverflow: boolean
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ) => void
  onSelectRows: (arr: (string | number)[]) => void
  provider: DraggableProvided
  selectedRows: (string | number)[]
  shadow: boolean
  tableConfig?: ITableConfig
  tableHeaders: ITableHeader[]
  tableRow: ITableRow
  withSelection: boolean
}

function DraggableRow(props: IProps): JSX.Element {
  const {
    Field,
    cssLeftValuesIterator,
    diffRow,
    isHorizontalOverflow,
    onRowUpdate,
    onSelectRows,
    provider,
    selectedRows,
    shadow,
    tableConfig,
    tableHeaders,
    tableRow,
    withSelection,
  } = props
  const { disabled } = tableConfig

  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const nonStickyHeaders = tableHeaders.filter((header) => !header.sticky)
  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0

  function handleSelectionChange(value: ChangeEvent<HTMLInputElement>): void {
    handleSingleRow(value, tableRow.id, onSelectRows, selectedRows)
  }

  function handleChange(
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ): void {
    onRowUpdate(tableRow.id, name, value, event)
  }

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
            cssLeftValuesIterator.next().value[1],
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
            cssLeftValuesIterator.next().value[1],
            shadow,
            stickyHeaders.length
          )}
        >
          <Checkbox
            checked={selectedRows ? selectedRows.includes(tableRow.id) : false}
            data-testid="draggable-single-row-selection"
            disabled={disabled}
            onChange={handleSelectionChange}
          />
        </StickyTableCell>
      )}

      {stickyHeaders.map((stickyHeader) => (
        <StickyTableCell
          key={stickyHeader.name}
          sx={stickyStyle(
            cssLeftValuesIterator.next().value[1],
            shadow,
            stickyHeader.isLastSticky,
            stickyHeader.type
          )}
        >
          <Field
            {...stickyHeader}
            diffValue={diffRow?.[stickyHeader.name]}
            disabled={disabled}
            label=""
            onChange={handleChange}
            row={tableRow}
            value={tableRow[stickyHeader.name]}
          />
        </StickyTableCell>
      ))}

      {nonStickyHeaders.map((header) => (
        <BaseTableCell sx={nonStickyStyle(header.type)} key={header.name}>
          <Field
            {...header}
            diffValue={diffRow?.[header.name]}
            disabled={disabled}
            label=""
            onChange={handleChange}
            row={tableRow}
            value={tableRow[header.name]}
          />
        </BaseTableCell>
      ))}
    </TableRow>
  )
}

DraggableRow.defaultProps = {
  tableConfig: {},
}

export default DraggableRow
