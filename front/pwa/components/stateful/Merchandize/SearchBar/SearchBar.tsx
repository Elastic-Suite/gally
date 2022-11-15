import { Grid, InputAdornment, Paper } from '@mui/material'
import InputText, { IInputTextProps } from '~/components/atoms/form/InputText'
import { useTranslation } from 'next-i18next'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { CustomNoTopProduct, SearchResult, SearchTitle } from './Search.styled'

interface IProps extends Omit<IInputTextProps, 'ref'> {
  nbResults: number
  nbTopProducts: number
}

export default function SearchBar(props: IProps): JSX.Element {
  const { nbResults, nbTopProducts, ...inputTextProps } = props
  const { t } = useTranslation('categories')

  const value = {
    value: nbResults + nbTopProducts,
    result: t('searchBar.results', { count: nbResults }),
  }

  const result = t('searchBarResult', { value })
  return (
    <Paper variant="outlined">
      <Grid container justifyContent="space-between" sx={{ padding: '16px' }}>
        <Grid container direction="column" sx={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SearchTitle>{t('searchBar.title')}</SearchTitle>
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
          </div>
          <SearchResult>
            {result} ({`${nbTopProducts} pinned`})
            {nbTopProducts === 0 && (
              <CustomNoTopProduct>{t('labelForPinProduct')}</CustomNoTopProduct>
            )}
          </SearchResult>
        </Grid>
      </Grid>
    </Paper>
  )
}
