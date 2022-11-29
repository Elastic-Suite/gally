import {
  FormControlLabel as MuiFormControlLabel,
  formControlLabelClasses,
  styled,
} from '@mui/material'

export const Container = styled('div')(({ theme }) => ({
  padding: `0 ${theme.spacing(2)}`,
}))

export const FormControlLabel = styled(MuiFormControlLabel)({
  [`& .${formControlLabelClasses.label}`]: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    flex: 1,
  },
})
