import { IFieldGuesserProps } from 'shared'

import EditableFieldGuesser from './EditableFieldGuesser'
import ReadableFieldGuesser from './ReadableFieldGuesser'

function FieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const { editable, ...fieldProps } = props

  if (editable) {
    return <EditableFieldGuesser {...fieldProps} />
  }
  return <ReadableFieldGuesser {...fieldProps} />
}

export default FieldGuesser
