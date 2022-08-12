import { keyframes, styled } from '@mui/system'

export const CustomRoot = styled('ul')({
  margin: 0,
  padding: 0,
  fontFamily: 'Inter',
  fontWeight: 500,
})

const opacity = keyframes`  
from {
  opacity: 0;
}

to {
  opacity: 1;
}
`
export const CustomLi = styled('li')(({ theme }) => ({
  listStyleType: 'none',
  paddingTop: theme.spacing(0.5),
  opacity: 0,
  animation: `${opacity} 1000ms forwards`,
}))

export const CustomTitle = styled('button')(({ theme }) => ({
  color: theme.palette.colors.secondary[600],
  position: 'relative',
  border: 'none',
  background: 'none',
  padding: 0,
  '&:hover::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '1px',
    top: `calc(100% + 1px)`,
    fontSize: '12px',
    background: theme.palette.colors.secondary[600],
  },
  '&:hover': {
    cursor: 'pointer',
  },
}))

export const CustomTitleBase = styled('button')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  position: 'relative',
  border: 'none',
  padding: 0,
  background: 'none',
  '&:hover::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '1px',
    top: `calc(100% + 1px)`,
    fontSize: '12px',
    background: 'black',
  },
  '&:hover': {
    cursor: 'pointer',
  },
}))

export const CustomTitleBaseSelected = styled('button')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  position: 'relative',
  border: 'none',
  padding: 0,
  background: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '1px',
    top: `calc(100% + 1px)`,
    fontSize: '12px',
    background: theme.palette.colors.neutral[900],
  },
}))

export const CustomTitleSelected = styled('button')(({ theme }) => ({
  color: theme.palette.colors.secondary[600],
  position: 'relative',
  border: 'none',
  padding: 0,
  background: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '1px',
    top: `calc(100% + 1px)`,
    fontSize: '12px',
    background: theme.palette.colors.secondary[600],
  },
}))

export const CustomContainer = styled('div')({
  marginTop: 1,
  marginBottom: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  height: '24px',
})

export const CustomVirtual = styled('span')(({ theme }) => ({
  color: theme.palette.colors.neutral['900'],
  fontSize: '10px',
  fontWeight: 600,
  lineHeight: '12px',
  background: theme.palette.colors.neutral['300'],
  paddingTop: '2px',
  paddingBottom: '2px',
  paddingRight: '4px',
  paddingLeft: '4px',
  borderRadius: theme.spacing(1),
  marginLeft: theme.spacing(0.75),
}))

export const CustomBtn = styled('button')(({ theme }) => ({
  color: theme.palette.colors.neutral['500'],
  borderRadius: '11px',
  width: '24px',
  boxSizing: 'border-box',
  height: '24px',
  textDecoration: 'none',
  border: 'none',
  fontSize: '24px',
  transition: 'transform 100ms linear',
  display: 'flex',
  justifyContent: 'center',
  padding: '2px',
  alignItems: 'center',
  background: 'none',
  '&:hover': {
    cursor: 'pointer',
    transform: 'rotate(180deg)',
    color: theme.palette.colors.secondary['600'],
    background: theme.palette.colors.secondary['100'],
  },
}))

export const CustomTitleContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
