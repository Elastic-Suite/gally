import { styled } from '@mui/system'
import Bandeau from './Rule'
import TypesConditions from './TypesConditions'
import TertiaryButton from '../buttons/TertiaryButton'
import IonIcon from '../IonIcon/IonIcon'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}))

const CustomConditionAndBandeau = styled('div')(({ theme }) => ({
  gap: theme.spacing(1),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
}))

const CustomCombinationFirst = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
  justifyContent: 'center',
  width: 'min-content',
  flexDirection: 'column',
  alignItems: 'baseline',
}))

const CombinationChild = styled('div')(({ theme }) => ({
  marginLeft: '42px',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingRight: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[300],
  gap: theme.spacing(1),
  width: 'min-content',
  flexDirection: 'column',
  display: 'flex',
  position: 'relative',
  alignItems: 'baseline',
  boxShadow: theme.palette.colors.shadow.neutral.sm,
}))

const CombinationChildAttr = styled(CombinationChild)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}))

const CustomTypesConditionsDouble = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: '-42px',
}))

const CustomTypesConditionsDoubleAttribute = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  transform: 'translateY(-50%)',
}))

interface IProps {
  id?: number
  rule?: any
  first?: boolean
  double?: string
  noBorderBottom?: boolean
}

// var filtered = someArray.filter(function(el) { return el.Name != "Kristian"; });
// for remove and object in array

function CombinationRules(props: IProps): JSX.Element {
  const { rule, first, double, noBorderBottom } = props

  function RemoveItem(id: number) {
    console.log(id)

    // var filtered = rule.filter((item: any) => {
    //   return item.id != id
    // })
    // console.log(filtered)
  }

  return (
    <CustomRoot>
      {first ? (
        <>
          <CustomCombinationFirst>
            <CustomConditionAndBandeau>
              <TypesConditions big={first} simple label={'if'} />
              <Bandeau
                operator={rule.operator}
                value={rule.value}
                deleteA={rule.id}
                RemoveItem={RemoveItem}
              />
            </CustomConditionAndBandeau>
          </CustomCombinationFirst>
          {rule.children &&
            rule.children.map((item: any, key: number) => {
              return rule.children.length === key + 1 ? (
                <div style={{ position: 'relative' }}>
                  <CombinationRules
                    rule={item}
                    first={false}
                    noBorderBottom={false}
                  />
                  <TertiaryButton
                    style={{ marginTop: '28px', marginLeft: '42px' }}
                  >
                    <IonIcon
                      name="add"
                      style={{ marginRight: '4px', fontSize: '19px' }}
                    />
                    Add condition
                  </TertiaryButton>
                </div>
              ) : (
                <CombinationRules
                  rule={item}
                  first={false}
                  double={rule.operator === 'all' ? 'and' : 'or'}
                  noBorderBottom={false}
                />
              )
            })}
        </>
      ) : rule.type === 'combination' ? (
        <CombinationChild
          style={{
            marginBottom: double && '24px',
            gap: rule.children && '16px',
          }}
        >
          {double && (
            <CustomTypesConditionsDouble>
              <TypesConditions simple={false} label={double} />
            </CustomTypesConditionsDouble>
          )}
          <CustomConditionAndBandeau>
            <TypesConditions
              big={first}
              simple
              label={'if'}
              verySimple={!rule.children && true}
            />
            <Bandeau
              field={rule.field}
              operator={rule.operator}
              value={rule.value}
              deleteA={rule.id}
              RemoveItem={RemoveItem}
            />
          </CustomConditionAndBandeau>
          {rule.children && (
            <CombinationChildAttr>
              {rule.children.map((item: any, key: number) => {
                return rule.children.length === key + 1 ? (
                  <>
                    <CombinationRules rule={item} first={false} />
                    <TertiaryButton>
                      <IonIcon
                        name="add"
                        style={{ marginRight: '4px', fontSize: '19px' }}
                      />
                      Add condition
                    </TertiaryButton>
                  </>
                ) : (
                  <CombinationRules
                    rule={item}
                    first={false}
                    double={rule.operator === 'all' ? 'and' : 'or'}
                    noBorderBottom={
                      rule.children.length === key + 2 &&
                      item.type !== 'combination'
                        ? false
                        : true
                    }
                  />
                )
              })}
            </CombinationChildAttr>
          )}
        </CombinationChild>
      ) : (
        <>
          <CustomConditionAndBandeau>
            {double && (
              <CustomTypesConditionsDoubleAttribute>
                <TypesConditions
                  simple={false}
                  label={double}
                  noBorderBottom={noBorderBottom}
                />
              </CustomTypesConditionsDoubleAttribute>
            )}
            <Bandeau
              field={rule.field}
              operator={rule.operator}
              value={rule.value}
              attr={true}
              deleteA={rule.id}
              RemoveItem={RemoveItem}
            />
          </CustomConditionAndBandeau>
        </>
      )}
    </CustomRoot>
  )
}

export default CombinationRules
