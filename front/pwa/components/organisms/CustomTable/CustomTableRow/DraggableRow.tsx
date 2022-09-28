import { ChangeEvent, FunctionComponent } from 'react'
import { Box, Checkbox, TableRow } from '@mui/material'
import { DraggableProvided } from 'react-beautiful-dnd'

import {
  IFieldGuesserProps,
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
  isHorizontalOverflow: boolean
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string
  ) => void
  onSelectRows: (arr: (string | number)[]) => void
  prevRow?: ITableRow
  provider: DraggableProvided
  selectedRows: (string | number)[]
  shadow: boolean
  tableHeaders: ITableHeader[]
  tableRow: ITableRow
  withSelection: boolean
}

function DraggableRow(props: IProps): JSX.Element {
  const {
    Field,
    cssLeftValuesIterator,
    isHorizontalOverflow,
    onRowUpdate,
    onSelectRows,
    prevRow,
    provider,
    selectedRows,
    shadow,
    tableHeaders,
    tableRow,
    withSelection,
  } = props

  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const nonStickyHeaders = tableHeaders.filter((header) => !header.sticky)
  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0

  function handleChange(name: string, value: boolean | number | string): void {
    onRowUpdate(tableRow.id, name, value)
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
            dirty={
              prevRow
                ? prevRow[stickyHeader.name] !== tableRow[stickyHeader.name]
                : false
            }
            label=""
            onChange={handleChange}
            value={tableRow[stickyHeader.name]}
          />
        </StickyTableCell>
      ))}

      {nonStickyHeaders.map((header) => (
        <BaseTableCell sx={nonStickyStyle(header.type)} key={header.name}>
          <Field
            {...header}
            dirty={
              prevRow ? prevRow[header.name] !== tableRow[header.name] : false
            }
            label=""
            onChange={handleChange}
            value={tableRow[header.name]}
          />
        </BaseTableCell>
      ))}
    </TableRow>
  )
}

export default DraggableRow
