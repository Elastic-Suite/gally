import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  alignItems: 'baseline',
}))

const CustomNbActiveLocales = styled('div')(({ theme }) => ({
  color: theme.palette.colors.primary[400],
  lineHeight: '62px',
  fontSize: '48px',
  fontWeight: '700',
  fontFamily: 'Inter',
}))

const CustomTexteActiveLocales = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[600],
  lineHeight: '24px',
  fontSize: '16px',
  fontWeight: '400',
  fontFamily: 'Inter',
}))

interface IProps {
  number: number
}

function NbActiveLocales({ number }: IProps): JSX.Element {
  const { t } = useTranslation('common')
  return (
    <CustomRoot>
      <CustomNbActiveLocales>{number}</CustomNbActiveLocales>
      <CustomTexteActiveLocales>
        {t('catalog.activeLocale', { count: number })}
      </CustomTexteActiveLocales>
    </CustomRoot>
  )
}

export default NbActiveLocales
