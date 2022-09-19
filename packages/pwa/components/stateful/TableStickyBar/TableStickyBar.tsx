import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react'
import { useTranslation } from 'next-i18next'
import { Box, Checkbox } from '@mui/material'
import { styled } from '@mui/system'

import { IField, IOptions, ITableRow, getFieldDataContentType } from 'shared'

import Button from '~/components/atoms/buttons/Button'
import Dropdown from '~/components/atoms/form/DropDown'

import FieldGuesser from '../FieldGuesser/FieldGuesser'

const ActionsButtonsContainer = styled(Box)({
  marginLeft: 'auto',
})

const Form = styled('form')({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
})

interface IProps {
  field: IField | ''
  fieldOptions: IOptions<IField>
  fieldValue: unknown
  onApply?: () => void
  onChangeField?: (value: IField | '') => void
  onChangeValue?: (name: string, value: unknown) => void
  onSelectedRows?: Dispatch<SetStateAction<(string | number)[]>>
  selectedRows?: (string | number)[]
  tableRows: ITableRow[]
}

function TableStickyBar(props: IProps): JSX.Element {
  const {
    field,
    fieldOptions,
    fieldValue,
    onApply,
    onChangeField,
    onChangeValue,
    onSelectedRows,
    selectedRows,
    tableRows,
  } = props
  const { t } = useTranslation('common')

  const withSelection = selectedRows?.length !== undefined

  let onSelection = null
  let massiveSelectionState = false
  let massiveSelectionIndeterminate = false
  if (withSelection) {
    massiveSelectionState = selectedRows.length === tableRows.length
    massiveSelectionIndeterminate =
      selectedRows.length > 0 ? selectedRows.length < tableRows.length : false

    onSelection = (e: ChangeEvent<HTMLInputElement>): void => {
      e.target.checked
        ? onSelectedRows(tableRows.map((row) => row.id))
        : onSelectedRows([])
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onApply()
  }

  return (
    <Form onSubmit={handleSubmit}>
      {Boolean(withSelection) && (
        <Checkbox
          indeterminate={massiveSelectionIndeterminate}
          checked={massiveSelectionState}
          onChange={onSelection}
        />
      )}
      {t('table.selected', { count: selectedRows.length })}
      <Dropdown
        onChange={onChangeField}
        options={fieldOptions}
        style={{ marginLeft: '32px', marginRight: '16px' }}
        value={field}
      />
      {field !== '' && (
        <FieldGuesser
          editable
          field={field}
          name={field.title}
          onChange={onChangeValue}
          type={getFieldDataContentType(field)}
          useDropdownBoolean
          value={fieldValue}
        />
      )}
      <ActionsButtonsContainer>
        <Button display="tertiary" onClick={(): void => onSelectedRows([])}>
          {t('table.cancel')}
        </Button>
        <Button sx={{ marginLeft: 1 }} type="submit">
          {t('table.apply')}
        </Button>
      </ActionsButtonsContainer>
    </Form>
  )
}

export default TableStickyBar
