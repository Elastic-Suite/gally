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
  error?: boolean
  fullWidth?: boolean
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  resizable?: boolean
}

function Textarea(props: IProps): JSX.Element {
  const {
    error,
    fullWidth,
    id,
    label,
    margin,
    maxLength,
    required,
    resizable,
    value,
    ...other
  } = props
  const maxLengthValue = maxLength ?? 250
  const valueString = String(value ?? '')
  return (
    <FormControl fullWidth={fullWidth} margin={margin} variant="standard">
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
          minWidth: 320,
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
