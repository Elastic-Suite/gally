import { styled } from '@mui/system'
import IonIcon from '../IonIcon/IonIcon'
import DropDownComponent from '../form/DropDown'
import { useState } from 'react'

const CustomRoot = styled('div')(({ theme }) => ({
  height: '42px',
  boxSizing: 'border-box',
  background: theme.palette.colors.neutral['200'],
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  width: 'fit-content',
  border: '1px solid',
  borderColor: theme.palette.colors.neutral['300'],
  borderRadius: theme.spacing(1),
  alignItems: 'center',
}))

const CustomClose = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(1),
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

const CustomDropDownBackgroundWhite = styled(DropDownComponent)(
  ({ theme }) => ({
    height: 'auto',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    width: 'max-content',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: theme.palette.colors.neutral['900'],
    fontWeight: 600,
    fontFamily: 'Inter',
    lineHeight: '18px',
    borderRadius: '99px',
    fontSize: '12px',
    '&>:nth-child(1)': {
      fontSize: '18px',
      color: theme.palette.colors.neutral['500'],
    },
  })
)

const CustomDropDownNoBackground = styled(DropDownComponent)(({ theme }) => ({
  height: 'auto',
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  width: 'max-content',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'none',
  fontFamily: 'Inter',
  border: 'none',
  color: theme.palette.colors.neutral['900'],
  fontWeight: 400,
  lineHeight: '18px',
  fontSize: '12px',
  '&>:nth-child(1)': {
    fontSize: '18px',
    color: theme.palette.colors.neutral['500'],
  },
}))

const CustomCombination = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  fontFamily: 'Inter',
  color: theme.palette.colors.neutral['900'],
  fontWeight: 400,
  lineHeight: '18px',
  fontSize: '12px',
  width: 'max-content',
}))

interface IProps {
  field?: string
  operator: string
  value: string
  attr?: boolean
  deleteA?: number
  RemoveItem: (id: number) => void
}

function Rule(props: IProps): JSX.Element {
  const { field, operator, value, attr, RemoveItem, deleteA } = props

  const [fieldValue, setFieldValue] = useState(field ? field : null)
  const [operatorValue, setOperatorValue] = useState(operator)
  const [valueValue, setValueValue] = useState(value)

  return (
    <CustomRoot style={{ marginLeft: attr && '40px' }}>
      {
        <CustomDropDownBackgroundWhite
          required
          options={[
            {
              label: field ? fieldValue : operatorValue,
              value: field ? fieldValue : operatorValue,
            },
          ]}
          value={field ? fieldValue : operatorValue}
          onChange={(e: string) => setFieldValue(e)}
        />
      }
      {field ? (
        <CustomDropDownNoBackground
          required
          options={[
            {
              label: operatorValue,
              value: operatorValue,
            },
          ]}
          value={operatorValue}
          onChange={(e: string) => setOperatorValue(e)}
        />
      ) : (
        <CustomCombination>conditions are</CustomCombination>
      )}
      <CustomDropDownBackgroundWhite
        required
        options={[
          {
            label: valueValue,
            value: valueValue,
          },
        ]}
        value={valueValue}
        onChange={(e: string) => setValueValue(e)}
      />
      <CustomClose onClick={() => RemoveItem(deleteA)}>
        <IonIcon name="close" style={{ fontSize: '17.85px' }} />
      </CustomClose>
    </CustomRoot>
  )
}

export default Rule
