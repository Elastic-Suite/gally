import { ChangeEvent } from 'react'
import { ITableHeader, ITableHeaderSticky } from '~/types'

export const manageStickyHeaders = (tableHeaders: ITableHeader[]) => {
  const stickyHeaders: ITableHeaderSticky[] = []
  const stickyColumnCount = tableHeaders.filter(
    (header) => header.sticky
  ).length
  tableHeaders
    .filter((header) => header.sticky)
    .forEach((stickyHeader, index) =>
      stickyHeaders.push({
        isLastSticky: index < stickyColumnCount - 1 ? false : true,
        ...stickyHeader,
      })
    )
  return stickyHeaders
}

export const handleSingleRow = (
  e: ChangeEvent<HTMLInputElement>,
  rowId: string,
  setSelectedRows: (arr: string[]) => void,
  selectedRows: string[]
) => {
  setSelectedRows(
    e.target.checked
      ? selectedRows.concat(rowId)
      : selectedRows.filter((value) => value !== rowId)
  )
}
