import { ChangeEvent } from 'react'
import { Checkbox, TableHead, TableRow } from '@mui/material'
import {
  BaseTableCell,
  StickyTableCell,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import {
  reorderingColumnWidth,
  selectionColumnWidth,
  stickyColunWidth,
} from '~/constants'
import { ITableHeader, ITableHeaderSticky } from '~/types'
import { manageStickyHeaders, stickyBorderStyle } from '../CustomTable.service'

interface IProps {
  tableHeaders: ITableHeader[]
  withSelection: boolean
  onSelection?: (e: ChangeEvent<HTMLInputElement>) => void
  massiveSelectionState?: boolean
  cSSLeftValues: number[]
  isHorizontalOverflow: boolean
  shadow: boolean
  massiveSelectionIndeterminate: boolean
}

function CustomTableHeader(props: IProps): JSX.Element {
  const {
    tableHeaders,
    withSelection,
    onSelection,
    massiveSelectionState,
    cSSLeftValues,
    isHorizontalOverflow,
    shadow,
    massiveSelectionIndeterminate,
  } = props

  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0
  const CSSLeftValuesIterator = cSSLeftValues.entries()

  return (
    <TableHead>
      <TableRow
        sx={{
          backgroundColor: 'neutral.light',
        }}
      >
        <StickyTableCell
          sx={{
            minWidth: `${reorderingColumnWidth}px`,
            width: `${reorderingColumnWidth}px`,
            borderBottomColor: 'colors.neutral.300',
            borderTopColor: 'colors.neutral.300',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            backgroundColor: 'neutral.light',
            ...(!isOnlyDraggable && { borderRight: 'none' }),
            ...(isOnlyDraggable &&
              isHorizontalOverflow &&
              stickyBorderStyle(shadow)),
            zIndex: '1',
            left: `${CSSLeftValuesIterator.next().value[1]}px`,
          }}
        />

        {Boolean(withSelection) && (
          <StickyTableCell
            sx={{
              borderBottomColor: 'colors.neutral.300',
              borderTopColor: 'colors.neutral.300',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              backgroundColor: 'neutral.light',
              width: `${selectionColumnWidth}px`,
              minWidth: `${selectionColumnWidth}px`,
              left: `${CSSLeftValuesIterator.next().value[1]}px`,
              ...(isHorizontalOverflow &&
                stickyHeaders.length === 0 &&
                stickyBorderStyle(shadow)),
            }}
            key="header-massiveselection"
          >
            <Checkbox
              data-testid="massive-selection"
              indeterminate={massiveSelectionIndeterminate}
              checked={massiveSelectionState}
              onChange={onSelection}
            />
          </StickyTableCell>
        )}

        {stickyHeaders.map((stickyHeader) => (
          <StickyTableCell
            key={stickyHeader.field}
            sx={{
              left: `${CSSLeftValuesIterator.next().value[1]}px`,
              borderBottomColor: 'colors.neutral.300',
              borderTopColor: 'colors.neutral.300',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              backgroundColor: 'neutral.light',
              zIndex: '1',
              minWidth: `${stickyColunWidth}px`,
              borderLeft: 'none',
              ...(stickyHeader.isLastSticky && stickyBorderStyle(shadow)),
            }}
          >
            {stickyHeader.headerName}
          </StickyTableCell>
        ))}

        {tableHeaders
          .filter((header) => !header.sticky)
          .map((header) => (
            <BaseTableCell
              sx={{
                height: '20px',
                padding: '14px 16px',
                borderBottomColor: 'colors.neutral.300',
                borderTopColor: 'colors.neutral.300',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                backgroundColor: 'neutral.light',
                whiteSpace: 'nowrap',
              }}
              key={header.field}
            >
              {header.headerName}
            </BaseTableCell>
          ))}
      </TableRow>
    </TableHead>
  )
}

export default CustomTableHeader
