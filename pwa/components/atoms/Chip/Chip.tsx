import { styled } from '@mui/system'
import { ChipProps, IconButton, Chip as MuiChip } from '@mui/material'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

const StyledChip = styled(MuiChip)(({ theme }) => ({
  display: 'inline-flex',
  height: '26px',
  color: theme.palette.colors.neutral['900'],
  fontFamily: 'Inter',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '18px',
  textAlign: 'center',
  alignItems: 'center',
  padding: `2px ${theme.spacing(1)}`,
  background: theme.palette.colors.neutral['300'],
  borderRadius: '13px',
  cursor: 'default',
  '&.MuiChip-colorPrimary': {
    color: theme.palette.colors.secondary['600'],
    background: theme.palette.colors.secondary['100'],
  },
  '&.MuiChip-colorSuccess': {
    color: theme.palette.success.main,
    background: theme.palette.success.light,
  },
  '&.MuiChip-colorWarning': {
    color: theme.palette.warning.main,
    background: theme.palette.warning.light,
  },
  '&.MuiChip-colorError': {
    color: theme.palette.error.main,
    background: theme.palette.error.light,
  },
  '&.MuiChip-sizeSmall': {
    height: '20px',
  },
  '& .MuiChip-label': {
    padding: 0,
  },
  '& .MuiChip-deleteIcon': {
    color: 'inherit',
    margin: `0 0 0 ${theme.spacing(0.5)}`,
    padding: 0,
    fontSize: '14px',
    '&:hover': {
      color: 'inherit',
      opacity: 0.5,
    },
  },
}))

function Chip(props: ChipProps): JSX.Element {
  return (
    <StyledChip
      {...props}
      deleteIcon={
        <IconButton>
          <IonIcon name="close" />
        </IconButton>
      }
    />
  )
}

export default Chip
