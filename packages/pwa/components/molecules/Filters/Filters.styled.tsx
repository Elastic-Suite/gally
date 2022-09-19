import { Paper, styled } from '@mui/material'

import {
  SecondaryButton,
  TertiaryButton,
} from '~/components/atoms/buttons/Button.styled'

export const FiltersPaper = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  marginBottom: theme.spacing(3),
}))

export const HeaderBox = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}))

export const SearchBox = styled('div')(({ theme }) => ({
  borderColor: theme.palette.colors.neutral[300],
  borderStyle: 'solid',
  borderWidth: '0 1px 0 0',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    borderWidth: 0,
  },
}))

export const FilterBox = styled('div')(({ theme }) => ({
  borderColor: theme.palette.colors.neutral[300],
  borderStyle: 'solid',
  borderWidth: 0,
  alignItems: 'center',
  display: 'flex',
  flex: 1,
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    borderWidth: '1px 0 0 0',
  },
}))

export const FilterSecondaryButton = styled(SecondaryButton)(() => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
}))

export const FacetteBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: theme.spacing(1),
  rowGap: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}))

export const FilterTertiaryButton = styled(TertiaryButton)(() => ({
  marginLeft: 'auto',
  whiteSpace: 'nowrap',
}))

export const ContentForm = styled('form')(({ theme }) => ({
  borderColor: theme.palette.colors.neutral[300],
  borderStyle: 'solid',
  borderWidth: '1px 0 0 0',
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(4),
}))

export const FiltersBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: theme.spacing(3),
  rowGap: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}))
