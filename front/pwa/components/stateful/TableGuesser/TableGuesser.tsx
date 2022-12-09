import {
  ChangeEvent,
  FunctionComponent,
  SyntheticEvent,
  useRef,
  useState,
} from 'react'

import { useApiEditableFieldOptions, useApiHeaders } from '~/hooks'
import {
  IField,
  IFieldGuesserProps,
  IHydraMember,
  IResource,
  IResourceEditableMassUpdate,
  ITableConfig,
  ITableRow,
  defaultPageSize,
} from 'shared'

import StickyBar from '~/components/molecules/CustomTable/StickyBar/StickyBar'
import PagerTable from '~/components/organisms/PagerTable/PagerTable'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TableStickyBar from '../TableStickyBar/TableStickyBar'

interface IProps<T extends IHydraMember> {
  Field?: FunctionComponent<IFieldGuesserProps>
  count?: number
  currentPage?: number
  diffRows?: ITableRow[]
  onMassupdate: IResourceEditableMassUpdate<T>
  onPageChange: (page: number) => void
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ) => void
  resource: IResource
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
  onRowsPerPageChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  noResult?: boolean
  tableConfigs?: ITableConfig[]
  tableRows: ITableRow[]
}

function TableGuesser<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const {
    Field,
    count,
    currentPage,
    diffRows,
    onMassupdate,
    onPageChange,
    onRowUpdate,
    resource,
    rowsPerPage,
    rowsPerPageOptions,
    onRowsPerPageChange,
    noResult,
    tableConfigs,
    tableRows,
  } = props
  const tableHeaders = useApiHeaders(resource)
  const fieldOptions = useApiEditableFieldOptions(resource)

  const tableRef = useRef<HTMLDivElement>()
  const [selectedField, setSelectedField] = useState<IField | ''>('')
  const [selectedValue, setSelectedValue] = useState<boolean | ''>('')
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([])

  const withSelection = selectedRows?.length !== undefined
  const activeRows = tableRows.filter(
    (_, index) => !(tableConfigs?.[index]?.selection.disabled ?? false)
  )
  const massiveSelectionState =
    withSelection && selectedRows
      ? selectedRows.length === activeRows.length
      : false
  const massiveSelectionIndeterminate =
    withSelection && selectedRows.length > 0
      ? selectedRows.length < activeRows.length
      : false

  function handleSelection(rowIds: (string | number)[] | boolean): void {
    if (rowIds instanceof Array) {
      setSelectedRows(rowIds)
    } else if (rowIds) {
      setSelectedRows(activeRows.map((row) => row.id))
    } else {
      setSelectedRows([])
    }
  }

  function handleChangeField(id: IField | ''): void {
    setSelectedField(id)
  }

  function handleChangeValue(_: string, value: boolean | ''): void {
    setSelectedValue(value)
  }

  function handleApply(): void {
    if (onMassupdate && selectedField !== '') {
      onMassupdate(selectedRows, {
        [selectedField.title]: selectedValue,
      } as unknown as Partial<T>)
    }
  }

  return (
    <>
      <PagerTable
        Field={Field}
        count={count}
        currentPage={currentPage ?? 0}
        diffRows={diffRows}
        massiveSelectionState={massiveSelectionState}
        massiveSelectionIndeterminate={massiveSelectionIndeterminate}
        onPageChange={onPageChange}
        onRowUpdate={onRowUpdate}
        onSelection={handleSelection}
        ref={tableRef}
        rowsPerPage={rowsPerPage ?? defaultPageSize}
        rowsPerPageOptions={rowsPerPageOptions ?? []}
        selectedRows={selectedRows}
        tableConfigs={tableConfigs}
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        onRowsPerPageChange={onRowsPerPageChange}
        noResult={noResult}
        withSelection={withSelection}
      />
      <StickyBar positionRef={tableRef} show={selectedRows.length > 0}>
        <TableStickyBar
          field={selectedField}
          fieldOptions={fieldOptions}
          fieldValue={selectedValue}
          massiveSelectionState={massiveSelectionState}
          massiveSelectionIndeterminate={massiveSelectionIndeterminate}
          onApply={handleApply}
          onChangeField={handleChangeField}
          onChangeValue={handleChangeValue}
          onSelection={handleSelection}
          selectedRows={selectedRows}
          withSelection={withSelection}
        />
      </StickyBar>
    </>
  )
}

TableGuesser.defaultProps = {
  Field: FieldGuesser,
}

export default TableGuesser
