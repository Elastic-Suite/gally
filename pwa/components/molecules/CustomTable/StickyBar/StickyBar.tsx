import { Box } from '@mui/system'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'
import { MassiveSelectionType } from '~/types'
import MassiveSelection from '../MassiveSelection/MassiveSelection'

interface IProps {
  show: boolean
  onMassiveSelection: (selection: MassiveSelectionType) => void
  massiveSelectionState: boolean
  massiveSelectionIndeterminate: boolean
}

function StickyBar(props: IProps): JSX.Element {
  const {
    show,
    onMassiveSelection,
    massiveSelectionState,
    massiveSelectionIndeterminate,
  } = props

  if (!show) {
    return null
  }

  return (
    <Box
      data-testid="sticky-bar"
      sx={{
        display: 'flex',
        borderRadius: '15px',
        position: 'fixed',
        bottom: '0',
        height: '64px',
        bgcolor: 'colors.white',
        border: 'solid',
        borderColor: 'neutral.light',
        zIndex: '2',
      }}
    >
      <MassiveSelection
        onSelection={onMassiveSelection}
        selectionState={massiveSelectionState}
        indeterminateState={massiveSelectionIndeterminate}
      />
      <TertiaryButton
        sx={{
          margin: '10px 8px 10px auto',
          padding: '8px 12px 8px 12px',
        }}
        onClick={(): void => onMassiveSelection(MassiveSelectionType.NONE)}
      >
        Cancel
      </TertiaryButton>
    </Box>
  )
}

export default StickyBar
