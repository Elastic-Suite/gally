import {
  FormControl,
  FormHelperText,
  InputLabel,
  TextareaAutosize,
} from '@mui/material'
import classNames from 'classnames'
import { TextareaAutosizeProps } from '@mui/base/TextareaAutosize/TextareaAutosize'

//Example get here https://codesandbox.io/s/n4t82?file=/src/index.js:612-654
interface IProps extends TextareaAutosizeProps {
  label?: string
  resizable?: boolean
  error?: boolean
}

function Textarea(props: IProps): JSX.Element {
  const { label, id, required, maxLength, resizable, error, value, ...other } =
    props
  const maxLengthValue = maxLength ?? 250
  const valueString = String(value ?? '')
  return (
    <FormControl variant="standard">
      {label ? (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
        </InputLabel>
      ) : null}
      <TextareaAutosize
        {...other}
        id={id}
        required={required}
        maxLength={maxLengthValue}
        style={{
          height: 150,
          width: 320,
          resize: resizable ? 'both' : 'none',
        }}
        className={classNames({
          'textarea--filled': valueString.length > 0,
          'textarea--error': error,
        })}
        value={valueString}
      />
      <FormHelperText style={{ display: 'block', textAlign: 'right' }}>
        {`${valueString.length}/${maxLengthValue}`}
      </FormHelperText>
    </FormControl>
  )
}

export default Textarea
