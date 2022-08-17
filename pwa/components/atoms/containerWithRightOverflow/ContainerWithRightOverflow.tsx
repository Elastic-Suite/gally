import { ReactChild, useState, useRef, useEffect } from 'react'
import { styled } from '@mui/system'
import IonIcon from '../IonIcon/IonIcon'

const CustomRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  overflowX: 'scroll',
}))

const CustomArrow = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  zIndex: 99,
  fontSize: '34px',
  cursor: 'pointer',
}))

const CustomShadow = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '0',
  height: '100%',
  width: '24px',
  zIndex: 9,
  background:
    'linear-gradient(90deg, rgba(21, 26, 71, 0) 0%, rgba(21, 26, 71, 0.07) 100%)',
  transition: 'all 500ms linear',
  '&:hover': {
    background:
      'linear-gradient(90deg, rgba(21, 26, 71, 0) 0%, rgba(21, 26, 71, 0.25) 100%)',
    cursor: 'pointer',
  },
}))

interface IProps {
  widthInit?: number
  widthMax?: number
  children?: ReactChild
}

function ContainerWithRightOverflow(props: IProps) {
  const { widthInit, widthMax, children } = props
  const [isLarge, setIsLarge] = useState(false)
  const width = isLarge ? widthMax : widthInit
  const left = isLarge ? 535 : 390

  return (
    <CustomRoot style={{ width: width }}>
      {children}
      <CustomArrow style={{ left: left }} onClick={() => setIsLarge(!isLarge)}>
        <IonIcon name="arrow" />
      </CustomArrow>
      {!isLarge && (
        <CustomShadow
          style={{ left: left - 7 }}
          onClick={() => setIsLarge(!isLarge)}
        />
      )}
    </CustomRoot>
  )
}

ContainerWithRightOverflow.defaultProps = {
  widthInit: 390,
  widthMax: 535,
}
export default ContainerWithRightOverflow
