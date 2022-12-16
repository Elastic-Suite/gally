import { ChangeEvent, FormEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { Box, Checkbox } from '@mui/material'
import { styled } from '@mui/system'

import { IField, IOptions, getFieldHeader } from 'shared'

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
  massiveSelectionState?: boolean
  massiveSelectionIndeterminate?: boolean
  onApply?: () => void
  onChangeField?: (value: IField | '') => void
  onChangeValue?: (name: string, value: unknown) => void
  onSelection?: (checked: boolean) => void
  selectedRows?: (string | number)[]
  withSelection?: boolean
}

function TableStickyBar(props: IProps): JSX.Element {
  const {
    field,
    fieldOptions,
    fieldValue,
    massiveSelectionState,
    massiveSelectionIndeterminate,
    onApply,
    onChangeField,
    onChangeValue,
    onSelection,
    selectedRows,
    withSelection,
  } = props
  const { t } = useTranslation('common')
  const { t: tApi } = useTranslation('api')
  const header = field ? getFieldHeader(field, tApi) : null

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onApply()
  }

  function handleSelection(event: ChangeEvent<HTMLInputElement>): void {
    onSelection(event.target.checked)
  }

  function handleCancelSelection(): void {
    onSelection(false)
  }

  return (
    <Form onSubmit={handleSubmit}>
      AAA
      {Boolean(withSelection) && (
        <Checkbox
          indeterminate={massiveSelectionIndeterminate}
          checked={massiveSelectionState}
          onChange={handleSelection}
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
          {...header}
          label=""
          onChange={onChangeValue}
          useDropdownBoolean
          value={fieldValue}
        />
      )}
      <ActionsButtonsContainer>
        <Button display="tertiary" onClick={handleCancelSelection}>
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
