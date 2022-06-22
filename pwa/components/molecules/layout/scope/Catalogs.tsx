import React from 'react'
import { styled } from '@mui/material/styles'
import TitleScope from '~/components/atoms/scope/TitleScope'
import NbActiveLocales from '~/components/atoms/scope/NbActiveLocales'
import Language from '~/components/atoms/scope/Language'

const CustomFullRoot = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))

const CustomNbCatalogs = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[600],
  lineHeight: '18px',
  fontSize: '12px',
  fontWeight: '400',
  fontFamily: 'Inter',
}))

const CustomRoot = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gridGap: theme.spacing(4),
  gridTemplateColumns: 'repeat(3,1fr)',
}))

const CustomCatalogs = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
  background: theme.palette.colors.neutral[0],
  border: '1px solid #E2E6F3',
  borderRadius: theme.spacing(1),
  gap: theme.spacing(3),
}))

interface IProps {
  content: any
}

const Catalogs = ({ content }: IProps) => {
  return (
    <CustomFullRoot>
      <CustomNbCatalogs>{content.length} catalogs</CustomNbCatalogs>
      <CustomRoot>
        {content.map((item: any, key: number) => (
          <CustomCatalogs key={key}>
            <TitleScope name={item.name} />
            <NbActiveLocales number={item.nbActiveLocales} />
            <Language
              order={key}
              language={item}
              content={content}
              limit={true}
            />
          </CustomCatalogs>
        ))}
      </CustomRoot>
    </CustomFullRoot>
  )
}

export default Catalogs
