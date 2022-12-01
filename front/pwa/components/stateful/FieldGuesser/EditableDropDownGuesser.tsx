import { SyntheticEvent, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { IFieldGuesserProps, LoadStatus } from 'shared'

import DropDown from '~/components/atoms/form/DropDown'
import { optionsContext } from '~/contexts'

interface IProps extends Omit<IFieldGuesserProps, 'onChange'> {
  onChange: (
    value: number | string | (number | string)[],
    event: SyntheticEvent
  ) => void
}

function EditableDropDownGuesser(props: IProps): JSX.Element {
  const {
    diffValue,
    disabled,
    field,
    label,
    multiple,
    onChange,
    options,
    required,
    value,
  } = props

  const { t } = useTranslation('common')
  const { fieldOptions, load, statuses } = useContext(optionsContext)
  const dropDownOptions =
    options ?? fieldOptions.get(field.property['@id']) ?? []
  const dirty = diffValue !== undefined && diffValue !== value

  useEffect(() => {
    if (!options && field) {
      load(field)
    }
  }, [field, load, options])

  // Wait to load the options before rendering to avoid problems
  if (
    value &&
    dropDownOptions.length === 0 &&
    statuses.current.get(field.property['@id']) !== LoadStatus.SUCCEEDED
  ) {
    return null
  }

  return (
    <DropDown
      dirty={dirty}
      disabled={disabled}
      helperText={
        Boolean(dirty) &&
        t('form.defaultValue', {
          value: dropDownOptions.find(({ value }) => value === diffValue)
            ?.label,
        })
      }
      label={label}
      multiple={multiple}
      options={dropDownOptions}
      required={required}
      value={value}
      onChange={onChange}
    />
  )
}

export default EditableDropDownGuesser
