import { SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { DataContentType, IFieldGuesserProps } from 'shared'

import DropDown from '~/components/atoms/form/DropDown'
import InputTextError from '~/components/atoms/form/InputTextError'
import RangeError from '~/components/atoms/form/RangeError'
import Switch from '~/components/atoms/form/Switch'

import ReadableFieldGuesser from './ReadableFieldGuesser'
import EditableDropDownGuesser from './EditableDropDownGuesser'

function EditableFieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const {
    diffValue,
    input,
    disabled,
    label,
    multiple,
    name,
    onChange,
    options,
    useDropdownBoolean,
    value,
    required,
    showError,
    suffix,
    type,
    validation,
  } = props
  const { t } = useTranslation('common')
  const dirty = diffValue !== undefined && diffValue !== value

  function handleChange(
    value: boolean | number | string | (boolean | number | string)[],
    event: SyntheticEvent
  ): void {
    if (onChange) {
      onChange(name, value, event)
    }
  }

  switch (input ?? type) {
    case DataContentType.NUMBER:
    case DataContentType.STRING: {
      return (
        <InputTextError
          dirty={dirty}
          disabled={disabled}
          helperText={
            Boolean(dirty) && t('form.defaultValue', { value: diffValue })
          }
          inputProps={validation}
          label={label}
          onChange={handleChange}
          required={required}
          showError={showError}
          suffix={suffix}
          type={input === DataContentType.NUMBER ? 'number' : 'text'}
          value={String(value)}
        />
      )
    }

    case DataContentType.RANGE: {
      return (
        <RangeError
          dirty={dirty}
          disabled={disabled}
          helperText={
            Boolean(dirty) && t('form.defaultValue', { value: diffValue })
          }
          inputProps={validation}
          label={label}
          onChange={handleChange}
          required={required}
          showError={showError}
          suffix={suffix}
          value={value as (string | number)[]}
        />
      )
    }

    case DataContentType.SELECT: {
      return <EditableDropDownGuesser {...props} onChange={handleChange} />
    }

    case DataContentType.BOOLEAN: {
      if (useDropdownBoolean) {
        return (
          <DropDown
            dirty={dirty}
            disabled={disabled}
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
          disabled={disabled}
          helperText={
            Boolean(dirty) &&
            t('form.defaultValue', { value: t(`switch.${diffValue}`) })
          }
          onChange={handleChange}
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
