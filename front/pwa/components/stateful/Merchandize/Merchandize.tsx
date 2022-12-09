import { SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { Grid, Paper } from '@mui/material'
import {
  ICategory,
  IOptions,
  IParsedCategoryConfiguration,
  getFieldConfig,
  getFieldState,
  isVirtualCategoryEnabled,
} from 'shared'

import { useResource } from '~/hooks'
import { selectBundles, useAppSelector } from '~/store'

import DropDown from '~/components/atoms/form/DropDown'
import Switch from '~/components/atoms/form/Switch'

interface IProps {
  catConf: IParsedCategoryConfiguration
  onChange?: (name: string, value: boolean | string) => void | Promise<void>
  sortOptions: IOptions<string>
  category: ICategory
}

function Merchandize({
  catConf,
  onChange,
  sortOptions,
  category,
}: IProps): JSX.Element {
  const { t } = useTranslation('categories')
  const bundles = useAppSelector(selectBundles)
  const catConfResource = useResource('CategoryConfiguration')
  const fieldConfigMap = new Map(
    catConfResource.supportedProperty.map((field) => [
      field.title,
      getFieldConfig(field),
    ])
  )

  function handleChange(value: string | boolean, event: SyntheticEvent): void {
    onChange((event.target as HTMLInputElement).name, value)
  }

  const isRootCategory = category.level === 1
  console.log(category)

  return (
    <Paper variant="outlined" style={{ height: 'auto', padding: '22px' }}>
      <Grid
        container
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={6}>
          <Switch
            checked={catConf?.useNameInProductSearch ?? false}
            infoTooltip={t('name.tooltip')}
            label={t('name')}
            name="useNameInProductSearch"
            onChange={handleChange}
            {...getFieldState(
              catConf as unknown as Record<string, unknown>,
              fieldConfigMap.get('useNameInProductSearch')?.depends
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <DropDown
            infoTooltip={t('select.tooltip')}
            label="Default sorting"
            name="defaultSorting"
            onChange={handleChange}
            options={sortOptions}
            value={catConf?.defaultSorting ?? ''}
            required
            {...getFieldState(
              catConf as unknown as Record<string, unknown>,
              fieldConfigMap.get('defaultSorting')?.depends
            )}
          />
        </Grid>
        {isVirtualCategoryEnabled(bundles) && (
          <Grid item xs={6}>
            <Switch
              checked={catConf?.isVirtual ?? false}
              infoTooltip={t('virtual.tooltip')}
              label={t('virtual')}
              name="isVirtual"
              disabled={isRootCategory}
              onChange={handleChange}
              {...getFieldState(
                catConf as unknown as Record<string, unknown>,
                fieldConfigMap.get('isVirtual')?.depends
              )}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}

export default Merchandize
