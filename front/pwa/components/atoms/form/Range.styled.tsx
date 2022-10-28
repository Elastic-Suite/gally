import { HTMLAttributes } from 'react'
import { styled } from '@mui/system'

import { InputTextStyled } from './InputText.styled'

interface IContainerProps extends HTMLAttributes<HTMLDivElement> {
  margin: 'dense' | 'none' | 'normal'
}

function Container(props: IContainerProps): JSX.Element {
  const { margin, ...divProps } = props
  return <div {...divProps} />
}

export const ContainerStyled = styled(Container)(({ margin, theme }) => ({
  position: 'relative',
  ...(margin === 'dense' && {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  }),
  ...(margin === 'normal' && {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }),
  '& label': {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  '& .MuiFormLabel-root': {
    color: theme.palette.colors.neutral[900],
  },
  '& .MuiFormLabel-root.Mui-error': {
    color: theme.palette.colors.neutral[900],
  },
}))

export const FirstInput = styled(InputTextStyled)({
  margin: '0 0.5em',
})

export const SecondInput = styled(InputTextStyled)({
  margin: '0 0 0 0.5em',
})
