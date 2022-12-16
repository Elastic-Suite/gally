import { ChangeEvent, FunctionComponent, SyntheticEvent } from 'react'
import { Checkbox, TableRow } from '@mui/material'

import {
  IFieldGuesserProps,
  ITableConfig,
  ITableHeader,
  ITableHeaderSticky,
  ITableRow,
  getFieldState,
  removeFirstOrLastCharOfString,
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
  cssLeftValues: number[]
  diffRow?: ITableRow
  isHorizontalOverflow: boolean
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ) => void
  onSelectRows: (arr: (string | number)[]) => void
  selectedRows: (string | number)[]
  shadow: boolean
  tableConfig?: ITableConfig
  tableHeaders: ITableHeader[]
  tableRow: ITableRow
  withSelection: boolean
  configuration: string[]
}

function NonDraggableRow(props: IProps): JSX.Element {
  const {
    Field,
    cssLeftValues,
    diffRow,
    isHorizontalOverflow,
    onRowUpdate,
    onSelectRows,
    selectedRows,
    shadow,
    tableConfig,
    tableHeaders,
    tableRow,
    withSelection,
    configuration,
  } = props
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
            cssLeftValues[0],
            isHorizontalOverflow,
            shadow
          ),
        }}
      />

      {Boolean(withSelection) && (
        <StickyTableCell
          sx={selectionStyle(
            isHorizontalOverflow,
            cssLeftValues[1],
            shadow,
            stickyHeaders.length
          )}
        >
          <Checkbox
            checked={selectedRows ? selectedRows.includes(tableRow.id) : false}
            data-testid="non-draggable-single-row-selection"
            onChange={handleSelectionChange}
            {...tableConfig.selection}
          />
        </StickyTableCell>
      )}

      {stickyHeaders.map((stickyHeader, i) => {
        return (
          <StickyTableCell
            key={stickyHeader.name}
            sx={stickyStyle(
              cssLeftValues[i + 1 + Number(withSelection)],
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
              row={tableRow}
              value={tableRow[stickyHeader.name]}
              {...getFieldState(
                tableRow,
                stickyHeader.depends,
                tableConfig[stickyHeader.name]
              )}
            />
          </StickyTableCell>
        )
      })}

      {nonStickyHeaders.map((header) => {
        const newUrlConfiguration =
          configuration &&
          removeFirstOrLastCharOfString(configuration[0], '/', 'last')

        const value =
          tableRow[header.name] && header.name === 'image'
            ? `${newUrlConfiguration}/${removeFirstOrLastCharOfString(
                tableRow[header.name] as string,
                '/',
                'first'
              )}`
            : tableRow[header.name]

        return (
          <BaseTableCell sx={nonStickyStyle(header.type)} key={header.name}>
            <Field
              {...header}
              diffValue={diffRow?.[header.name]}
              label=""
              onChange={handleChange}
              row={tableRow}
              value={value}
              {...getFieldState(
                tableRow,
                header.depends,
                tableConfig[header.name]
              )}
            />
          </BaseTableCell>
        )
      })}
    </TableRow>
  )
}

NonDraggableRow.defaultProps = {
  tableConfig: {},
}

export default NonDraggableRow
