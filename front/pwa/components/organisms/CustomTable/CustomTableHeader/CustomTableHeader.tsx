import { ChangeEvent } from 'react'
import { Checkbox, TableHead, TableRow } from '@mui/material'
import {
  BaseTableCell,
  StickyTableCell,
} from '~/components/organisms/CustomTable/CustomTable.styled'
import {
  DataContentType,
  ITableHeader,
  ITableHeaderSticky,
  reorderingColumnWidth,
  selectionColumnWidth,
  stickyColunWidth,
} from 'shared'
import { manageStickyHeaders, stickyBorderStyle } from '../CustomTable.service'
import { useTranslation } from 'next-i18next'

interface IProps {
  cssLeftValues: number[]
  isHorizontalOverflow: boolean
  massiveSelectionIndeterminate: boolean
  massiveSelectionState?: boolean
  onSelection?: (e: ChangeEvent<HTMLInputElement>) => void
  shadow: boolean
  tableHeaders: ITableHeader[]
  withSelection: boolean
}

function CustomTableHeader(props: IProps): JSX.Element {
  const {
    cssLeftValues,
    isHorizontalOverflow,
    massiveSelectionIndeterminate,
    massiveSelectionState,
    onSelection,
    shadow,
    tableHeaders,
    withSelection,
  } = props

  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0
  const { t } = useTranslation('api')

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
            left: `${cssLeftValues[0]}px`,
            zIndex: 3,
          }}
        >
          &nbsp;
        </StickyTableCell>

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
              left: `${cssLeftValues[1]}px`,
              ...(isHorizontalOverflow &&
                stickyHeaders.length === 0 &&
                stickyBorderStyle(shadow)),
              zIndex: 3,
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

        {stickyHeaders.map((stickyHeader, i) => (
          <StickyTableCell
            key={stickyHeader.name}
            sx={{
              left: `${cssLeftValues[i + 1 + Number(withSelection)]}px`,
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
            {stickyHeader.label}
          </StickyTableCell>
        ))}

        {tableHeaders
          .filter((header) => !header.sticky)
          .map((header) => (
            <BaseTableCell
              key={header.name}
              sx={{
                height: '20px',
                padding: '14px 16px',
                borderBottomColor: 'colors.neutral.300',
                borderTopColor: 'colors.neutral.300',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                backgroundColor: 'neutral.light',
                whiteSpace: 'nowrap',
                ...((header.type === DataContentType.SCORE ||
                  header.type === DataContentType.PRICE) && { width: '5%' }),
                ...(header.type === DataContentType.STOCK && { width: '15%' }),
                ...(header.type === DataContentType.STRING && {
                  maxWidth: 'fit-content',
                }),
              }}
            >
              {t(header.label)}
            </BaseTableCell>
          ))}
      </TableRow>
    </TableHead>
  )
}

export default CustomTableHeader
