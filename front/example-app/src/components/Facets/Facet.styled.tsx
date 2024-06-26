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

export const FacetLinks = styled('div')({
  display: 'flex',
  flexDirection: 'column',
})

export const FacetLink = styled('button')(({ theme }) => ({
  ...theme.typography.body1,
  display: 'flex',
  justifyContent: 'space-between',
  background: 'transparent',
  border: 0,
  padding: 0,
  margin: 0,
  flex: 1,
  marginRight: '16px',
  cursor: 'pointer',
  marginBottom: theme.spacing(1),

  '&.active': {
    color: theme.palette.primary.main,
  },
}))
