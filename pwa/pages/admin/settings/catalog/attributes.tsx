import { Checkbox, Grid, Switch } from '@mui/material'
import { HydraResponse } from '~/types'
import { useApiFetch } from '~/hooks/useApi'

const Attributes = () => {
  const [sourceFields] = useApiFetch<HydraResponse>('/source_fields')

  if (sourceFields.error) {
    return sourceFields.error.toString()
  } else if (!sourceFields.data) {
    return null
  }

  // Components ??? => need to develop components in storybook () ?
  // Translations ??? => custom fetch with headers / i18n-routing ? (https://nextjs.org/docs/advanced-features/i18n-routing) / backend translated with accept-language header ?
  // Columns ??? => fixed or based on docs.json schema ?
  return (
    <>
      <Grid container spacing={2} mb={2} columns={{ xs: 13 }}>
        <Grid item xs={1}>
          <Checkbox />
        </Grid>
        <Grid item xs={2}>
          Attribute code
        </Grid>
        <Grid item xs={2}>
          Attribute label
        </Grid>
        <Grid item xs={2}>
          Attribute type
        </Grid>
        <Grid item xs={2}>
          Filterable
        </Grid>
        <Grid item xs={2}>
          Searchable
        </Grid>
        <Grid item xs={2}>
          Sortable
        </Grid>
      </Grid>
      {sourceFields.data['hydra:member'].map((member, i) => (
        <Grid key={i} container spacing={2} mb={2} columns={{ xs: 13 }}>
          <Grid item xs={1}>
            <Checkbox />
          </Grid>
          <Grid item xs={2}>
            {member.code}
          </Grid>
          <Grid item xs={2}>
            {member.defaultLabel}
          </Grid>
          <Grid item xs={2}>
            {member.type}
          </Grid>
          <Grid item xs={2}>
            <Switch
              inputProps={{ 'aria-label': 'Filterable' }}
              checked={Boolean(member.filterable)}
            />
          </Grid>
          <Grid item xs={2}>
            <Switch
              inputProps={{ 'aria-label': 'Searchable' }}
              checked={Boolean(member.searchable)}
            />
          </Grid>
          <Grid item xs={2}>
            <Switch
              inputProps={{ 'aria-label': 'Sortable' }}
              checked={Boolean(member.sortable)}
            />
          </Grid>
        </Grid>
      ))}
    </>
  )
}

export default Attributes
