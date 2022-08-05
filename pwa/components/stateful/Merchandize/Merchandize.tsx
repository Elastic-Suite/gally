import { ChangeEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { Grid, Paper } from '@mui/material'
import { FontRequired } from './Merchandize.style'
import DropDown, { ISelectProps } from '~/components/atoms/form/DropDown'
import SwitchComp from '~/components/atoms/form/SwitchComp'

function Merchandize({
  onCategoryNameChange,
  onVirtualCategoryChange,
  useCategoryNameValue,
  virtualCategoryValue,
  args,
  ...props
}: {
  onCategoryNameChange: (arg: boolean) => void
  onVirtualCategoryChange: (arg: boolean) => void
  useCategoryNameValue: boolean
  virtualCategoryValue: boolean
  args: ISelectProps
  onChange: (arg: string) => void
}): JSX.Element {
  const { t } = useTranslation('category')

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === 'checkedA')
      onCategoryNameChange(event.target.checked)
    else onVirtualCategoryChange(event.target.checked)
  }

  return (
    <Paper variant="outlined" style={{ height: 'auto', padding: '16px' }}>
      <FontRequired
        container
        justifyContent="flex-end"
        alignItems="center"
        style={{ width: '100%' }}
      >
        {t('category.required')}
      </FontRequired>

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
          <SwitchComp
            label={t('category.name')}
            labelInfo={t('category.name.tooltip')}
            handleChange={handleChange}
            value={useCategoryNameValue}
            name="checkedA"
          />
          <SwitchComp
            label={t('category.virtual')}
            labelInfo={t('category.virtual.tooltip')}
            handleChange={handleChange}
            value={virtualCategoryValue}
            name="checkedB"
          />
        </Grid>

        <Grid
          container
          style={{ width: '50%' }}
          justifyContent="flex-start"
          alignItems="center"
        >
          <DropDown
            {...args}
            {...props}
            infoTooltip={t('category.select.tooltip')}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Merchandize
