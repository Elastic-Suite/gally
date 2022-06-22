import React from 'react'
import { styled } from '@mui/material/styles'

const CustomTitleScope = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  lineHeight: '30px',
  fontSize: '20px',
  fontWeight: '600',
  fontFamily: 'Inter',
}))

interface IProps {
  name: string
}

const TitleScope = ({ name }: IProps) => {
  return <CustomTitleScope>{name}</CustomTitleScope>
}

export default TitleScope
