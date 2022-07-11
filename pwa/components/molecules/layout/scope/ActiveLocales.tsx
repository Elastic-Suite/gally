import { styled } from '@mui/material/styles'
import TitleScope from '~/components/atoms/scope/TitleScope'
import NbActiveLocales from '~/components/atoms/scope/NbActiveLocales'
import Language from '~/components/atoms/scope/Language'
import { IHydraResponse } from '~/types'

const CustomRoot = styled('div')(({ theme }) => ({
  width: '671px',
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
  content: IHydraResponse | IHydraResponse[]
}

function ActiveLocales({ content }: IProps): JSX.Element {
  return (
    <CustomRoot>
      {content.map((item: string) => (
        <div key={item}>{item}</div>
      ))}
    </CustomRoot>
  )
}

export default ActiveLocales
