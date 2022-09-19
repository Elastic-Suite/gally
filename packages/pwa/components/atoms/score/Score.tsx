import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { BoostType } from 'shared'
import Boost from '../boost/Boost'

interface IProps {
  scoreValue: number
  type?: BoostType
  boostNumber?: number
  boostMultiplicator?: number
}

const ScoreContainer = styled(Box)({
  display: 'block',
  fontWeight: '550',
  fontFamily: 'inter',
  fontSize: '16px',
  lineHeight: '24px',
  align: 'left',
  verticalAlign: 'center',
})

function Score(props: IProps): JSX.Element {
  const { scoreValue, type, boostNumber, boostMultiplicator } = props

  return (
    <Box>
      <ScoreContainer>{scoreValue}</ScoreContainer>
      {Boolean(type) && (
        <Boost
          type={type}
          boostNumber={boostNumber}
          boostMultiplicator={boostMultiplicator}
        />
      )}
    </Box>
  )
}

export default Score
