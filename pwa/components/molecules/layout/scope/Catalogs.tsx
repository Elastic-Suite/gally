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
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
  background: theme.palette.colors.white,
  border: '1px solid #E2E6F3',
  borderRadius: 8,
  gap: theme.spacing(3),
}))

interface IProps {
  content: string[]
}

interface ILocalName {
  localName: string
}

interface ILocalizedCatalogs {
  localizedCatalogs: ILocalName[]
  name: string
}

const Catalogs = ({ content }: IProps) => {
  function Languages(data: ILocalizedCatalogs) {
    let Languages = []
    for (const localizedCatalogsContent of data.localizedCatalogs) {
      Languages = [...Languages, localizedCatalogsContent.localName]
    }
    return (Languages = [...new Set(Languages)])
  }

  return (
    <CustomFullRoot>
      <CustomNbCatalogs>
        {content['hydra:member'].length +
          ' ' +
          (content['hydra:member'].length > 1 ? 'catalogs' : 'catalog')}
      </CustomNbCatalogs>
      <CustomRoot>
        {content['hydra:member'].map(
          (item: ILocalizedCatalogs, key: number) => (
            <CustomCatalogs key={key}>
              <TitleScope name={item.name} />
              <NbActiveLocales number={[...new Set(Languages(item))].length} />
              <Language
                order={key}
                language={Languages(item)}
                content={content['hydra:member']}
                limit={true}
              />
            </CustomCatalogs>
          )
        )}
      </CustomRoot>
    </CustomFullRoot>
  )
}

export default Catalogs
