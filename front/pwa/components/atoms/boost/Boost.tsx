import { Box } from '@mui/system'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

interface IProps {
  type: 'up' | 'down' | 'no boost'
  boostNumber: number
  boostMultiplicator: number
}
interface IBoostDetails {
  boostText: string
  boostColor: string
  boostTextColor: string
  boostIconName: string
}

function setBoostDetails(
  type: 'up' | 'down' | 'no boost',
  boostNumber: number,
  boostMultiplicator: number
): IBoostDetails {
  switch (type) {
    case 'up':
      return {
        boostText: ` x${boostMultiplicator} ( ${boostNumber} boost) `,
        boostColor: 'success.light',
        boostTextColor: 'success.main',
        boostIconName: 'trending-up-outline',
      }
    case 'down':
      return {
        boostText: ` x${boostMultiplicator} ( ${boostNumber} boost) `,
        boostColor: 'error.light',
        boostTextColor: 'error.main',
        boostIconName: 'trending-down-outline',
      }
    case 'no boost':
      return {
        boostText: 'no boost',
        boostColor: 'neutral.light',
        boostTextColor: 'colors.neutral.600',
        boostIconName: 'arrow-forward-outline',
      }
  }
}

function Boost(props: IProps): JSX.Element {
  const { type, boostNumber, boostMultiplicator } = props

  const boostDetail = setBoostDetails(type, boostNumber, boostMultiplicator)

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      <Box
        sx={{
          backgroundColor: boostDetail.boostColor,
          color: boostDetail.boostTextColor,
          height: '20px',
          width: '20px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IonIcon
          name={boostDetail.boostIconName}
          style={
            type === 'no boost'
              ? { width: '14px', height: '14px' }
              : { width: '14px', height: '8px' }
          }
        />
      </Box>
      <Box
        sx={{
          color: boostDetail.boostTextColor,
          fontFamily: 'inter',
          fontWeight: '500',
          fontSize: '12px',
          lineHeight: '18px',
        }}
      >
        {boostDetail.boostText}
      </Box>
    </Box>
  )
}

export default Boost
