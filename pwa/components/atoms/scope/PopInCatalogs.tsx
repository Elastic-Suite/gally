import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { keyframes } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import TitleScope from '~/components/atoms/scope/TitleScope'
import NbActiveLocales from '~/components/atoms/scope/NbActiveLocales'
import Language from '~/components/atoms/scope/Language'

const Opacity = keyframes({
  from: {
    opacity: 0,
  },

  to: {
    opacity: 1,
  },
})

const CustomFullRoot = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  zIndex: 99,
  background: 'rgba(21, 26, 71, 0.6)',
  animation: `${Opacity} 1000ms forwards`,
  opacity: 0,
})

const CustomRoot = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  background: theme.palette.colors.neutral[0],
  borderRadius: theme.spacing(1),
}))

const CustomPopIn = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  background: theme.palette.background.default,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  width: '600px',
  zIndex: 999,
  animation: `${Opacity} 1000ms forwards`,
  opacity: 0,
}))

const CustomClose = styled('div')(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  top: theme.spacing(2),
  right: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 500ms',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  color: theme.palette.colors.neutral['900'],
  '&:hover': {
    background: theme.palette.colors.neutral['200'],
  },
}))

interface PopInProps {
  content: any
  onClose: Function
}

const PopInCatalogs = ({ content, onClose }: PopInProps) => {
  return (
    <>
      <CustomFullRoot></CustomFullRoot>
      <CustomPopIn>
        <CustomClose onClick={() => onClose()}>
          <IonIcon name="close" style={{ fontSize: '17.85px' }} />
        </CustomClose>
        <CustomRoot>
          <TitleScope name={content.name} />
          <NbActiveLocales number={content.nbActiveLocales} />
          <Language language={content.language} limit={false} />
        </CustomRoot>
      </CustomPopIn>
    </>
  )
}

export default PopInCatalogs
