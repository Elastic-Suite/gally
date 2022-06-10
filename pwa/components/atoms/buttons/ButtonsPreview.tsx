import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import {
  Grid,
  RadioGroup,
  Fab,
  Switch,
  Radio,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import SecondaryButton from '~/components/atoms/buttons/SecondaryButton'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'

const ButtonsPreview = () => {
  const label = { inputProps: { 'aria-label': 'Switch demo' } }

  return (
    <div>
      {/*Primary buttons*/}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={2}>
          <PrimaryButton size="large">Button text</PrimaryButton>
        </Grid>
        <Grid item xs={10}>
          <PrimaryButton size="large" disabled>
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton size="medium">Button text</PrimaryButton>
        </Grid>
        <Grid item xs={10}>
          <PrimaryButton size="medium" disabled>
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton size="small">Button text</PrimaryButton>
        </Grid>
        <Grid item xs={10}>
          <PrimaryButton size="small" disabled>
            Button text
          </PrimaryButton>
        </Grid>
      </Grid>

      {/*Secondary buttons*/}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={2}>
          <SecondaryButton size="large">Button text</SecondaryButton>
        </Grid>
        <Grid item xs={10}>
          <SecondaryButton size="large" disabled>
            Button text
          </SecondaryButton>
        </Grid>
        <Grid item xs={2}>
          <SecondaryButton size="medium">Button text</SecondaryButton>
        </Grid>
        <Grid item xs={10}>
          <SecondaryButton size="medium" disabled>
            Button text
          </SecondaryButton>
        </Grid>
        <Grid item xs={2}>
          <SecondaryButton size="small">Button text</SecondaryButton>
        </Grid>
        <Grid item xs={10}>
          <SecondaryButton size="small" disabled>
            Button text
          </SecondaryButton>
        </Grid>
      </Grid>

      {/*Secondary buttons*/}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={2}>
          <TertiaryButton size="large">Button text</TertiaryButton>
        </Grid>
        <Grid item xs={10}>
          <TertiaryButton size="large" disabled>
            Button text
          </TertiaryButton>
        </Grid>
        <Grid item xs={2}>
          <TertiaryButton size="medium">Button text</TertiaryButton>
        </Grid>
        <Grid item xs={10}>
          <TertiaryButton size="medium" disabled>
            Button text
          </TertiaryButton>
        </Grid>
        <Grid item xs={2}>
          <TertiaryButton size="small">Button text</TertiaryButton>
        </Grid>
        <Grid item xs={10}>
          <TertiaryButton size="small" disabled>
            Button text
          </TertiaryButton>
        </Grid>
      </Grid>

      {/*Primary icon buttons*/}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={2}>
          <PrimaryButton
            size="large"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            size="large"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={8}>
          <PrimaryButton size="large" style={{ padding: '12px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            disabled
            size="large"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            disabled
            size="large"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={8}>
          <PrimaryButton disabled size="large" style={{ padding: '12px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            size="medium"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            size="medium"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={8}>
          <PrimaryButton size="medium" style={{ padding: '8px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            disabled
            size="medium"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            disabled
            size="medium"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={8}>
          <PrimaryButton disabled size="medium" style={{ padding: '8px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            size="small"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            size="small"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={8}>
          <PrimaryButton size="small" style={{ padding: '4px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            disabled
            size="small"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={2}>
          <PrimaryButton
            disabled
            size="small"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </PrimaryButton>
        </Grid>
        <Grid item xs={8}>
          <PrimaryButton disabled size="small" style={{ padding: '4px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </PrimaryButton>
        </Grid>
      </Grid>

      {/*Secondary icon buttons*/}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={2}>
          <SecondaryButton
            size="large"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </SecondaryButton>
        </Grid>
        <Grid item xs={2}>
          <SecondaryButton
            size="large"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </SecondaryButton>
        </Grid>
        <Grid item xs={8}>
          <SecondaryButton size="large" style={{ padding: '12px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </SecondaryButton>
        </Grid>
        <Grid item xs={2}>
          <SecondaryButton
            size="medium"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </SecondaryButton>
        </Grid>
        <Grid item xs={2}>
          <SecondaryButton
            size="medium"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </SecondaryButton>
        </Grid>
        <Grid item xs={8}>
          <SecondaryButton size="medium" style={{ padding: '8px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </SecondaryButton>
        </Grid>
        <Grid item xs={2}>
          <SecondaryButton
            size="small"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </SecondaryButton>
        </Grid>
        <Grid item xs={2}>
          <SecondaryButton
            size="small"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </SecondaryButton>
        </Grid>
        <Grid item xs={8}>
          <SecondaryButton size="small" style={{ padding: '4px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </SecondaryButton>
        </Grid>
      </Grid>

      {/*Tertiary icon buttons*/}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={2}>
          <TertiaryButton
            size="large"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </TertiaryButton>
        </Grid>
        <Grid item xs={2}>
          <TertiaryButton
            size="large"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </TertiaryButton>
        </Grid>
        <Grid item xs={8}>
          <TertiaryButton size="large" style={{ padding: '12px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </TertiaryButton>
        </Grid>
        <Grid item xs={2}>
          <TertiaryButton
            size="medium"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </TertiaryButton>
        </Grid>
        <Grid item xs={2}>
          <TertiaryButton
            size="medium"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </TertiaryButton>
        </Grid>
        <Grid item xs={8}>
          <TertiaryButton size="medium" style={{ padding: '8px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </TertiaryButton>
        </Grid>
        <Grid item xs={2}>
          <TertiaryButton
            size="small"
            startIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </TertiaryButton>
        </Grid>
        <Grid item xs={2}>
          <TertiaryButton
            size="small"
            endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
          >
            Button text
          </TertiaryButton>
        </Grid>
        <Grid item xs={8}>
          <TertiaryButton size="small" style={{ padding: '4px' }}>
            <IonIcon name="add-outline" style={{ fontSize: 24 }} />
          </TertiaryButton>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={2}>
        {/*Checkboxes*/}
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox />} label="Label" />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Label"
          />
          <FormControlLabel
            control={<Checkbox indeterminate={true} />}
            label="Label"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel disabled control={<Checkbox />} label="Label" />
          <FormControlLabel
            disabled
            control={<Checkbox defaultChecked />}
            label="Label"
          />
          <FormControlLabel
            disabled
            control={<Checkbox indeterminate={true} />}
            label="Label"
          />
        </Grid>

        {/*Checkboxes with select*/}
        <Grid item xs={12}>
          <FormControlLabel control={<Checkbox />} label="Label" />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Label"
          />
          <FormControlLabel
            control={<Checkbox indeterminate={true} />}
            label="Label"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel disabled control={<Checkbox />} label="Label" />
          <FormControlLabel
            disabled
            control={<Checkbox defaultChecked />}
            label="Label"
          />
          <FormControlLabel
            disabled
            control={<Checkbox indeterminate={true} />}
            label="Label"
          />
        </Grid>

        {/*Radio buttons*/}
        <Grid item xs={12}>
          <RadioGroup row defaultValue="female" name="radio-buttons-group">
            <FormControlLabel
              value="male"
              control={<Radio defaultChecked />}
              label="Label"
            />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Label"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            disabled
            value="label"
            control={<Radio defaultChecked />}
            label="Label"
          />
          <FormControlLabel
            disabled
            value="label"
            control={<Radio />}
            label="Label"
          />
        </Grid>

        {/*Switch buttons*/}
        <Grid item xs={12}>
          <Switch {...label} />
          <Switch {...label} defaultChecked />
        </Grid>
        <Grid item xs={12}>
          <Switch {...label} disabled />
          <Switch {...label} disabled defaultChecked />
        </Grid>

        {/*Floating buttons*/}
        <Grid item xs={12}>
          <Fab size="medium" aria-label="add">
            <IonIcon name="code-slash-outline" />
          </Fab>
        </Grid>
        <Grid item xs={12}>
          <Fab disabled aria-label="add">
            <IonIcon name="code-slash-outline" />
          </Fab>
        </Grid>
      </Grid>
    </div>
  )
}

export default ButtonsPreview
