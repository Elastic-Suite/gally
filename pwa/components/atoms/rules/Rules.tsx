import { styled } from '@mui/system'
import Banbdeau from './Bandeau'

const Rules = (): JSX.Element => {
  return (
    <Banbdeau
      blockOne={[
        { label: 'Any', value: 'any' },
        { label: 'All', value: 'all' },
        { label: 'Age', value: 'age' },
      ]}
      blockTwo={[
        { label: 'conditions are', value: 'conditions_are' },
        { label: 'is one of', value: 'is_one_of' },
        { label: 'is', value: 'is' },
      ]}
      BlockThree={[
        { label: 'true', value: 'true' },
        { label: 'false', value: 'false' },
        { label: 'red', value: 'red' },
      ]}
    />
  )
}

export default Rules
