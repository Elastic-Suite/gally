import { Grid, InputAdornment, Paper } from '@mui/material'
import InputText, {
  IProps as IInputTextProps,
} from '~/components/atoms/form/InputText'
import { useTranslation } from 'next-i18next'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { SearchResult, SearchTitle } from './Search.styled'
interface IProps extends IInputTextProps {
  nbRes: number
}

export default function SearchBar(props: IProps): JSX.Element {
  const { nbRes, ...inputTextProps } = props
  const { t } = useTranslation('category')

  const result = `${nbRes} ${t('searchBar.results')}`
  return (
    <Paper>
      <Grid container justifyContent="space-between" sx={{ padding: '16px' }}>
        <Grid container direction="column" sx={{ width: 'auto' }}>
          <SearchTitle>{t('searchBar.title')}</SearchTitle>
          <SearchResult>{result}</SearchResult>
        </Grid>
        <InputText
          {...inputTextProps}
          color="primary"
          placeholder={t('searchBar.placeholder')}
          endAdornment={
            <InputAdornment position="end">
              <IonIcon name="search" />
            </InputAdornment>
          }
        />
      </Grid>
    </Paper>
  )
}
