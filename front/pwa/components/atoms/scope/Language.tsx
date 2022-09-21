import { styled } from '@mui/system'

import { ICatalog, firstLetterUppercase } from 'shared'

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

interface IProps {
  language: string[]
  limit: boolean
  content?: ICatalog[]
  order?: number
}
const NB_ACTIVE_LOCALES_BY_WEBSITE = 5

function Language({ language, order, limit, content }: IProps): JSX.Element {
  const newLanguage = [...new Set(language)]

  return (
    <CustomRoot>
      {newLanguage
        ? newLanguage.map((item: string, key: number) => (
            <div key={item}>
              {limit === true ? (
                key === NB_ACTIVE_LOCALES_BY_WEBSITE ? (
                  <div>
                    <PopInCatalogs
                      content={content[order]}
                      title={`+${
                        newLanguage.length - NB_ACTIVE_LOCALES_BY_WEBSITE
                      }`}
                    />
                  </div>
                ) : (
                  key < 5 && (
                    <CustomLanguage key={item}>
                      {firstLetterUppercase(item)}
                    </CustomLanguage>
                  )
                )
              ) : (
                <CustomLanguage key={item}>
                  {firstLetterUppercase(item)}
                </CustomLanguage>
              )}
            </div>
          ))
        : null}
    </CustomRoot>
  )
}

export default Language
