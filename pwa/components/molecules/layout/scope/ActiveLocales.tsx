import { styled } from '@mui/material/styles'
import TitleScope from '~/components/atoms/scope/TitleScope'
import NbActiveLocales from '~/components/atoms/scope/NbActiveLocales'
import Language from '~/components/atoms/scope/Language'

const CustomRoot = styled('div')(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  background: theme.palette.colors.white,
  border: '1px solid #E2E6F3',
  borderRadius: 8,
}))

interface IProps {
  content: string[]
}

const ActiveLocales = ({ content }: IProps) => {
  let Languages = []
  for (const hydraContent of content['hydra:member']) {
    for (const localizedCatalogsContent of hydraContent.localizedCatalogs) {
      Languages = [...Languages, localizedCatalogsContent.localName]
    }
  }
  Languages = [...new Set(Languages)]

  return (
    <CustomRoot>
      <TitleScope name="Total" />
      <NbActiveLocales number={Languages.length} />
      <Language language={Languages} limit={false} />
    </CustomRoot>
  )
}

export default ActiveLocales
