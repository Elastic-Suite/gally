import { ChangeEvent, FunctionComponent } from 'react'
import { Checkbox, TableRow } from '@mui/material'

import {
  IFieldGuesserProps,
  ITableHeader,
  ITableHeaderSticky,
  ITableRow,
} from 'shared'

import {
  BaseTableCell,
  StickyTableCell,
} from '~/components/organisms/CustomTable/CustomTable.styled'

import { handleSingleRow, manageStickyHeaders } from '../CustomTable.service'

import {
  draggableColumnStyle,
  nonStickyStyle,
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
    value: boolean | number | string
  ) => void
  onSelectRows: (arr: (string | number)[]) => void
  selectedRows: (string | number)[]
  shadow: boolean
  tableHeaders: ITableHeader[]
  tableRow: ITableRow
  withSelection: boolean
}

function NonDraggableRow(props: IProps): JSX.Element {
  const {
    Field,
    cssLeftValuesIterator,
    diffRow,
    isHorizontalOverflow,
    onRowUpdate,
    onSelectRows,
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
    <TableRow key={tableRow.id}>
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
      />

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
            diffValue={diffRow?.[header.name]}
            label=""
            onChange={handleChange}
            value={tableRow[header.name]}
          />
        </BaseTableCell>
      ))}
    </TableRow>
  )
}

export default NonDraggableRow
