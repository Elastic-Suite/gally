import { ChangeEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { Grid, Paper } from '@mui/material'
import DropDown, { ISelectProps } from '~/components/atoms/form/DropDown'
import SwitchLabel from '~/components/atoms/form/SwitchLabel'

interface IProps {
  onCategoryNameChange?: (arg: boolean) => void
  onVirtualCategoryChange?: (arg: boolean) => void
  categoryNameValue: boolean
  virtualCategoryValue: boolean
  args: ISelectProps
  onChange?: (arg: number | string) => void
  value?: number | string
}

function Merchandize({
  onCategoryNameChange,
  onVirtualCategoryChange,
  categoryNameValue,
  virtualCategoryValue,
  args,
  ...props
}: IProps): JSX.Element {
  const { t } = useTranslation('category')

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === 'checkedA')
      onCategoryNameChange(event.target.checked)
    else onVirtualCategoryChange(event.target.checked)
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
          <SwitchLabel
            label={t('name')}
            labelInfo={t('name.tooltip')}
            onChange={handleChange}
            checked={categoryNameValue}
            name="checkedA"
          />
          <SwitchLabel
            label={t('virtual')}
            labelInfo={t('virtual.tooltip')}
            onChange={handleChange}
            checked={virtualCategoryValue}
            name="checkedB"
          />
        </Grid>

        <Grid
          container
          style={{ width: '50%' }}
          justifyContent="flex-start"
          alignItems="center"
        >
          <DropDown {...args} {...props} infoTooltip={t('select.tooltip')} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Merchandize
