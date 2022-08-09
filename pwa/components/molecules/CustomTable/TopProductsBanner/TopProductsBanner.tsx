import { Box, styled } from '@mui/system'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

const BannerContainer = styled(Box)(({ theme }) => ({
  height: '34px',
  background: theme.palette.colors.gradient.default,
  borderRadius: '8px 8px 0 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 4px',
  gap: '8px',
  color: theme.palette.colors.white,
}))

const BannerText = styled(Box)({
  lineHeight: '18px',
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'Inter',
  fontStyle: 'normal',
})

interface IProps {
  bannerText: string
}

function TopProductsBanner(props: IProps): JSX.Element {
  const { bannerText } = props

  return (
    <BannerContainer>
      <IonIcon name="trending-up-outline" style={{ color: 'colors.white' }} />
      <BannerText>{bannerText}</BannerText>
    </BannerContainer>
  )
}

export default TopProductsBanner
