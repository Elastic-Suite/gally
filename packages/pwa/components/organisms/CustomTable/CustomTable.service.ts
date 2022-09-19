import { ChangeEvent } from 'react'
import { IStickyBorderStyle, ITableHeader, ITableHeaderSticky } from 'shared'

export function manageStickyHeaders(
  tableHeaders: ITableHeader[]
): ITableHeaderSticky[] {
  const stickyHeaders: ITableHeaderSticky[] = []
  const stickyColumnCount = tableHeaders.filter(
    (header) => header.sticky
  ).length
  tableHeaders
    .filter((header) => header.sticky)
    .map((stickyHeader: ITableHeader, index: number) =>
      stickyHeaders.push({
        isLastSticky: !(index < stickyColumnCount - 1),
        ...stickyHeader,
      })
    )
  return stickyHeaders
}

export function handleSingleRow(
  e: ChangeEvent<HTMLInputElement>,
  rowId: string | number,
  onSelectRows: (arr: (string | number)[]) => void,
  selectedRows: (string | number)[]
): void {
  onSelectRows(
    e.target.checked
      ? selectedRows.concat(rowId)
      : selectedRows.filter((value) => value !== rowId)
  )
}

export function stickyBorderStyle(shadow: boolean): IStickyBorderStyle {
  return {
    borderBottomColor: 'colors.neutral.300',
    borderRight: '2px solid',
    borderRightColor: 'colors.neutral.600',
    ...(shadow && {
      boxShadow: '5px 0 460px -10px',
      clipPath: 'inset(0px -15px 0px 0px)',
    }),
  }
}
