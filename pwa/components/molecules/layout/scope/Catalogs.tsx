import { styled } from '@mui/material/styles'
import TitleScope from '~/components/atoms/scope/TitleScope'
import NbActiveLocales from '~/components/atoms/scope/NbActiveLocales'
import Language from '~/components/atoms/scope/Language'
import { IHydraResponse } from '~/types'
import { getUniqueLocalName } from '~/services/local'
import { useTranslation } from 'next-i18next'

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
  content: IHydraResponse | IHydraResponse[]
}

interface ILocalName {
  localName: string
}

interface ILocalizedCatalogs {
  localizedCatalogs: ILocalName[]
  name: string
}

function Catalogs({ content }: IProps): JSX.Element {
  const { t } = useTranslation()
  return (
    <CustomFullRoot>
      <CustomNbCatalogs>
        {content['hydra:member'].length}{' '}
        {t('catalog', { count: content['hydra:member'].length })}
      </CustomNbCatalogs>
      <CustomRoot>
        {content['hydra:member'].map(
          (item: ILocalizedCatalogs, key: number) => (
            <CustomCatalogs key={item.name}>
              <TitleScope name={item.name} />
              <NbActiveLocales number={getUniqueLocalName(item).length} />
              <Language
                order={key}
                language={getUniqueLocalName(item)}
                content={content['hydra:member']}
                limit
              />
            </CustomCatalogs>
          )
        )}
      </CustomRoot>
    </CustomFullRoot>
  )
}

export default Catalogs
