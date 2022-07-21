import { ChangeEvent } from 'react'
import { ITableHeader, ITableHeaderSticky } from '~/types'

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
  setSelectedRows: (arr: (string | number)[]) => void,
  selectedRows: (string | number)[]
): void {
  setSelectedRows(
    e.target.checked
      ? selectedRows.concat(rowId)
      : selectedRows.filter((value) => value !== rowId)
  )
}
