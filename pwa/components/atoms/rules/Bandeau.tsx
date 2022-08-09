import { styled } from '@mui/system'
import IonIcon from '../IonIcon/IonIcon'
import DropDownComponent from '../form/DropDown'
import { IOption } from '~/types'
import { useState } from 'react'

const CustomRoot = styled('div')(({ theme }) => ({
  background: theme.palette.colors.neutral['200'],
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  width: 'fit-content',
  border: '1px solid',
  borderColor: theme.palette.colors.neutral['300'],
  borderRadius: theme.spacing(1),
  alignItems: 'center',
}))

const CustomClose = styled('div')(({ theme }) => ({
  display: 'flex',
  cursor: 'pointer',
  transition: 'all 500ms',
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  color: theme.palette.colors.neutral['600'],
  '&:hover': {
    background: theme.palette.colors.neutral['300'],
  },
}))

interface IProps {
  blockOne: IOption[]
  blockTwo: IOption[]
  BlockThree: IOption[]
}

const Banbdeau = ({ blockOne, blockTwo, BlockThree }: IProps): JSX.Element => {
  const [blocksOneValues, setBlocksValues] = useState(blockOne[0].value)
  const [blocksTwoValues, setBlocksTwoValues] = useState(blockTwo[0].value)
  const [blocksThreeValues, setBlockThreeValues] = useState(BlockThree[0].value)

  return (
    <CustomRoot>
      <DropDownComponent
        required
        options={blockOne}
        value={blocksOneValues}
        style={{ color: 'red' }}
        onChange={(e: string) => setBlocksValues(e)}
      />
      <DropDownComponent
        required
        options={blockTwo}
        value={blocksTwoValues}
        onChange={(e: string) => setBlocksTwoValues(e)}
      />
      <DropDownComponent
        required
        options={BlockThree}
        value={blocksThreeValues}
        onChange={(e: string) => setBlockThreeValues(e)}
      />
      <CustomClose onClick={() => alert('CLOSE')}>
        <IonIcon name="close" style={{ fontSize: '17.85px' }} />
      </CustomClose>
    </CustomRoot>
  )
}

export default Banbdeau
