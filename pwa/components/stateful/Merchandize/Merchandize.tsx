import { ChangeEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { Grid, Paper } from '@mui/material'
import DropDown from '~/components/atoms/form/DropDown'
import Switch from '~/components/atoms/form/Switch'
import { IOptions } from '~/types'

interface IProps {
  onNameChange?: (arg: boolean) => void | Promise<void>
  onVirtualChange?: (arg: boolean) => void | Promise<void>
  categoryNameValue: boolean
  virtualCategoryValue: boolean
  sortOptions: IOptions<string>
  onSortChange?: (arg: string) => void | Promise<void>
  sortValue?: number | string
}

function Merchandize({
  onNameChange,
  onVirtualChange,
  categoryNameValue,
  virtualCategoryValue,
  sortOptions,
  sortValue,
  onSortChange,
}: IProps): JSX.Element {
  const { t } = useTranslation('categories')

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === 'name') {
      onNameChange(event.target.checked)
    } else {
      onVirtualChange(event.target.checked)
    }
  }

  return (
    <Paper variant="outlined" style={{ height: 'auto', padding: '16px' }}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ width: '100%' }}
      >
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          style={{ width: '50%' }}
        >
          <Switch
            label={t('name')}
            labelInfo={t('name.tooltip')}
            onChange={handleChange}
            checked={categoryNameValue}
            name="name"
          />
          <Switch
            label={t('virtual')}
            labelInfo={t('virtual.tooltip')}
            onChange={handleChange}
            checked={virtualCategoryValue}
            name="virtual"
          />
        </Grid>

        <Grid
          container
          style={{ width: '50%' }}
          justifyContent="flex-start"
          alignItems="center"
        >
          <DropDown
            options={sortOptions}
            label={t('default.sorting')}
            value={sortValue}
            onChange={onSortChange}
            infoTooltip={t('select.tooltip')}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Merchandize
