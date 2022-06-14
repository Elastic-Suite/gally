import { Box } from '@mui/system'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { MassiveSelectionType } from '~/types'
import MassiveSelection from '../MassiveSelection/MassiveSelection'

interface IProps {
  show: boolean
  onMassiveSelection: (selection: MassiveSelectionType) => void
  massiveSelectionState: boolean
}

const StickyBar = (props: IProps) => {
  const { show, onMassiveSelection, massiveSelectionState } = props

  if (!show) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: '15px',
        position: 'sticky',
        bottom: '50px',
        height: '64px',
        bgcolor: 'colors.white',
        border: 'solid',
        borderColor: 'neutral.light',
      }}
    >
      <MassiveSelection
        onSelection={onMassiveSelection}
        selectionState={massiveSelectionState}
      />
      <TertiaryButton
        sx={{
          margin: '10px 8px 10px auto',
          padding: '8px 12px 8px 12px',
        }}
      >
        Cancel
      </TertiaryButton>
      <TertiaryButton
        sx={{
          color: 'colors.black',
          margin: '10px 0 10px 0',
          padding: '8px 12px 8px 12px',
        }}
      >
        <Box
          sx={{
            fontSize: '25px',
          }}
        >
          <IonIcon name="download-outline" />
        </Box>
        Export (CSV)
      </TertiaryButton>
      <PrimaryButton
        sx={{
          margin: '10px 32px 10px 8px',
        }}
      >
        Apply
      </PrimaryButton>
    </Box>
  )
}

export default StickyBar
