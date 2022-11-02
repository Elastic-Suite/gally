import { FormControl, styled } from '@mui/material'

const HeaderFormControl = styled(FormControl)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  '& .MuiInputBase-root': {
    color: theme.palette.common.white,
    minWidth: 100,
  },
  '& .MuiFormLabel-root': {
    color: theme.palette.common.white,
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.common.white,
  },
  '& .MuiOutlinedInput-notchedOutline legend': {
    maxWidth: '100%',
  },
  '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.common.white,
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: theme.palette.common.white,
  },
  '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.common.white,
  },
}))

export default HeaderFormControl
