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

interface IProps {
  language: string[]
  limit: boolean
  content?: { name: string; nbActiveLocales: number; language: Array<string> }[]
  order?: number
}

const Language = ({ language, order, limit, content }: IProps) => {
  const newLanguage = [...new Set(language)]
  return (
    <CustomRoot>
      {newLanguage &&
        newLanguage.map((item: string, key: number) => (
          <div key={key}>
            {limit === true ? (
              <>
                {key === 3 ? (
                  <PopInCatalogs
                    content={content[order]}
                    title={newLanguage.length}
                  />
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
  )
}

export default Language
