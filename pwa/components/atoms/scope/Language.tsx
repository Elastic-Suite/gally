import { styled } from '@mui/material/styles'
import PopInCatalogs from './PopInCatalogs'
import { firstLetterUppercase } from '~/services/format'

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
  content?: {
    name: string
    language: string[]
  }
  order?: number
}

function Language({ language, order, limit, content }: IProps): JSX.Element {
  const newLanguage = [...new Set(language)]
  const nbActiveLocalesByWebSite = 5

  return (
    <CustomRoot>
<<<<<<< HEAD
      {newLanguage
        ? newLanguage.map((item: string, key: number) => (
            <div key={item}>
              {limit === true ? (
                key === 3 ? (
                  <PopInCatalogs
                    content={content[order]}
                    title={newLanguage.length}
                  />
                ) : (
                  key < 3 && <CustomLanguage key={item}>{item}</CustomLanguage>
                )
              ) : (
                <CustomLanguage key={item}>{item}</CustomLanguage>
              )}
            </div>
          ))
        : null}
=======
      {newLanguage &&
        newLanguage.map((item: string, key: number) => (
          <div key={key}>
            {limit === true ? (
              <>
                {key === nbActiveLocalesByWebSite ? (
                  <div>
                    <PopInCatalogs
                      content={content[order]}
                      title={
                        '+' + (newLanguage.length - nbActiveLocalesByWebSite)
                      }
                    />
                  </div>
                ) : (
                  key < 5 && (
                    <CustomLanguage key={key}>
                      {firstLetterUppercase(item)}
                    </CustomLanguage>
                  )
                )}
              </>
            ) : (
              <CustomLanguage key={key}>
                {firstLetterUppercase(item)}
              </CustomLanguage>
            )}
          </div>
        ))}
>>>>>>> ESPP_174 : fix for api
    </CustomRoot>
  )
}

export default Language
