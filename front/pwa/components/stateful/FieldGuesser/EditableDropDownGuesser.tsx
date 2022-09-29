import { useTranslation } from 'next-i18next'
import { IFieldGuesserProps } from 'shared'

import DropDown from '~/components/atoms/form/DropDown'
import { useContext, useEffect } from 'react'
import { optionsContext } from '~/contexts'

interface IProps extends Omit<IFieldGuesserProps, 'onChange'> {
  onChange: (value: number | string) => void
}

function EditableDropDownGuesser(props: IProps): JSX.Element {
  const {
    diffValue,
    field,
    label,
    multiple,
    onChange,
    options,
    required,
    value,
  } = props

  const { t } = useTranslation('common')
  const { fieldOptions, load } = useContext(optionsContext)
  const dropDownOptions =
    options ?? fieldOptions.get(field.property['@id']) ?? []
  const dirty = diffValue !== undefined && diffValue !== value

  useEffect(() => {
    if (!options && field) {
      load(field)
    }
  }, [field, load, options])

  return (
    <DropDown
      dirty={dirty}
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
