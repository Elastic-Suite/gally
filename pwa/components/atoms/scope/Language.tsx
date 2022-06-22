import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import PopInCatalogs from './PopInCatalogs'

const CustomRoot = styled('div')(({ theme }) => ({
  gap: theme.spacing(1),
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
}))

const CustomLanguage = styled('div')(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.colors.neutral[900],
  lineHeight: '18px',
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingRight: theme.spacing(1.5),
  paddingLeft: theme.spacing(1.5),
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'Inter',
  background: theme.palette.colors.neutral[300],
  borderRadius: '99px',
}))

const CustumOtherLanguage = styled(CustomLanguage)(({ theme }) => ({
  color: theme.palette.colors.secondary[600],
  cursor: 'pointer',
}))

interface IProps {
  language: any
  limit: boolean
  content?: Array<string>
  order?: number
}

const Language = ({ language, order, limit, content }: IProps) => {
  const newLanguage = limit
    ? [...new Set(language.language)]
    : [...new Set(language)]
  const [visible, setVisible] = useState(null)

  return (
    <>
      <CustomRoot>
        {newLanguage &&
          newLanguage.map((item: any, key: number) => (
            <div key={key}>
              {limit === true ? (
                <>
                  {key === 3 ? (
                    <CustumOtherLanguage
                      key={key}
                      onClick={() => setVisible(order + 1)}
                    >
                      +{newLanguage.length}
                    </CustumOtherLanguage>
                  ) : (
                    key < 3 && <CustomLanguage key={key}>{item}</CustomLanguage>
                  )}
                </>
              ) : (
                <CustomLanguage key={key}>{item}</CustomLanguage>
              )}
            </div>
          ))}
      </CustomRoot>
      {visible && (
        <PopInCatalogs
          content={content[visible - 1]}
          onClose={() => setVisible(null)}
        />
      )}
    </>
  )
}

export default Language
