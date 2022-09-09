import { Grid, InputAdornment, Paper } from '@mui/material'
import InputText, { IInputTextProps } from '~/components/atoms/form/InputText'
import { useTranslation } from 'next-i18next'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { SearchResult, SearchTitle } from './Search.styled'

interface IProps extends Omit<IInputTextProps, 'ref'> {
  nbResults: number
}

export default function SearchBar(props: IProps): JSX.Element {
  const { nbResults, ...inputTextProps } = props
  const { t } = useTranslation('categories')

  const value = {
    value: nbResults,
    result: t('searchBar.results', { count: nbResults }),
  }

  const result = t('searchBarResult', { value })
  return (
    <Paper variant="outlined">
      <Grid container justifyContent="space-between" sx={{ padding: '16px' }}>
        <Grid container direction="column" sx={{ width: 'auto' }}>
          <SearchTitle>{t('searchBar.title')}</SearchTitle>
          <SearchResult>{result}</SearchResult>
        </Grid>
        <InputText
          id="input-text"
          required={false}
          disabled={false}
          helperText=""
          helperIcon=""
          {...inputTextProps}
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
