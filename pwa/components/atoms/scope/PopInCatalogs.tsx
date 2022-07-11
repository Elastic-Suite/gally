import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { styled } from '@mui/material/styles'
import TitleScope from '~/components/atoms/scope/TitleScope'
import NbActiveLocales from '~/components/atoms/scope/NbActiveLocales'
import Language from '~/components/atoms/scope/Language'

const CustomClose = styled('div')(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  top: theme.spacing(2),
  right: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 500ms',
  padding: theme.spacing(1),
  borderRadius: 8,
  color: theme.palette.colors.neutral['900'],
  '&:hover': {
    background: theme.palette.colors.neutral['200'],
  },
}))

const CustumOtherLanguage = styled('div')(({ theme }) => ({
  textAlign: 'center',
  lineHeight: '18px',
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingRight: theme.spacing(1.5),
  paddingLeft: theme.spacing(1.5),
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'Inter',
  background: theme.palette.colors.neutral[300],
  borderRadius: '99px',
  color: theme.palette.colors.secondary[600],
  cursor: 'pointer',
}))

const CustomRoot = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  background: theme.palette.colors.white,
  borderRadius: 8,
}))

interface IProps {
  content: ILocalizedCatalogs
  title: string
}

interface ILocalName {
  localName: string
}

interface ILocalizedCatalogs {
  localizedCatalogs: ILocalName[]
  name: string
}

function PopInCatalogs({ content, title }: IProps): JSX.Element {
  const [open, setOpen] = useState(false)

  function handleClickOpen(): void {
    setOpen(true)
  }

  function handleClose(): void {
    setOpen(false)
  }

  function Languages(data: ILocalizedCatalogs) {
    let Languages = []
    for (const localizedCatalogsContent of data.localizedCatalogs) {
      Languages = [...Languages, localizedCatalogsContent.localName]
    }
    return (Languages = [...new Set(Languages)])
  }

  return (
    <>
      <CustumOtherLanguage onClick={handleClickOpen}>
        {title}
      </CustumOtherLanguage>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CustomClose onClick={handleClose}>
          <IonIcon name="close" style={{ fontSize: '17.85px' }} />
        </CustomClose>
        <CustomRoot>
          <TitleScope name={content.name} />
          <NbActiveLocales number={[...new Set(Languages(content))].length} />
          <Language language={[...new Set(Languages(content))]} limit={false} />
        </CustomRoot>
      </Dialog>
    </>
  )
}

export default PopInCatalogs
