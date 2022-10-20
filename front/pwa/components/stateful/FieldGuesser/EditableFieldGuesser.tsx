import { ChangeEvent, SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { DataContentType, IFieldGuesserProps } from 'shared'

import DropDown from '~/components/atoms/form/DropDown'
import InputTextError from '~/components/atoms/form/InputTextError'
import Switch from '~/components/atoms/form/Switch'

import ReadableFieldGuesser from './ReadableFieldGuesser'
import EditableDropDownGuesser from './EditableDropDownGuesser'

function EditableFieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const {
    diffValue,
    label,
    multiple,
    name,
    onChange,
    options,
    type,
    useDropdownBoolean,
    value,
    required,
    validation,
  } = props
  const { t } = useTranslation('common')
  const dirty = diffValue !== undefined && diffValue !== value

  function handleChange(value: number | string, event: SyntheticEvent): void {
    if (onChange) {
      onChange(name, value, event)
    }
  }

  function handleSwitchChange(event: ChangeEvent<HTMLInputElement>): void {
    if (onChange) {
      onChange(name, event.target.checked, event)
    }
  }

  switch (type) {
    case DataContentType.NUMBER:
    case DataContentType.PERCENTAGE:
    case DataContentType.STRING: {
      return (
        <InputTextError
          dirty={dirty}
          helperText={
            Boolean(dirty) && t('form.defaultValue', { value: diffValue })
          }
          inputProps={validation}
          label={label}
          onChange={handleChange}
          required={required}
          sufix={type === DataContentType.PERCENTAGE ? '%' : ''}
          type={
            type === DataContentType.NUMBER || DataContentType.PERCENTAGE
              ? 'number'
              : 'text'
          }
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
            dirty={dirty}
            helperText={
              Boolean(dirty) && t('form.defaultValue', { value: diffValue })
            }
            label={label}
            multiple={multiple}
            options={
              options ?? [
                { label: t('filter.yes'), value: true },
                { label: t('filter.no'), value: false },
              ]
            }
            required={required}
            value={value}
            onChange={handleChange}
          />
        )
      }
      return (
        <Switch
          checked={Boolean(value)}
          helperText={
            Boolean(dirty) &&
            t('form.defaultValue', { value: t(`switch.${diffValue}`) })
          }
          onChange={handleSwitchChange}
          required={required}
        />
      )
    }

    default: {
      return <ReadableFieldGuesser {...props} />
    }
  }
}

export default EditableFieldGuesser
