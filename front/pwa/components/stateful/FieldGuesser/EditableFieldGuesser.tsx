import { Switch } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { DataContentType, IFieldGuesserProps } from 'shared'

import DropDown from '~/components/atoms/form/DropDown'
import InputText from '~/components/atoms/form/InputText'

import ReadableFieldGuesser from './ReadableFieldGuesser'
import EditableDropDownGuesser from './EditableDropDownGuesser'

function EditableFieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const {
    label,
    multiple,
    name,
    onChange,
    options,
    type,
    useDropdownBoolean,
    value,
    required,
  } = props
  const { t } = useTranslation('common')

  function handleChange(value: number | string): void {
    if (onChange) {
      onChange(name, value)
    }
  }

  function handleSwitchChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    if (onChange) {
      onChange(name, event.target.checked)
    }
  }

  switch (type) {
    case DataContentType.STRING: {
      return (
        <InputText
          required={required}
          label={label}
          onChange={handleChange}
          value={String(value)}
        />
      )
    }

    case DataContentType.DROPDOWN: {
      return <EditableDropDownGuesser {...props} onChange={handleChange} />
    }

    case DataContentType.BOOLEAN: {
      if (useDropdownBoolean) {
        return (
          <DropDown
            required={required}
            label={label}
            multiple={multiple}
            options={
              options ?? [
                { label: t('filter.yes'), value: true },
                { label: t('filter.no'), value: false },
              ]
            }
            value={value}
            onChange={handleChange}
          />
        )
      }
      return (
        <Switch
          required={required}
          onChange={handleSwitchChange}
          checked={Boolean(value)}
        />
      )
    }

    default: {
      return <ReadableFieldGuesser {...props} />
    }
  }
}

export default EditableFieldGuesser
