import { useEffect } from 'react'
import { styled } from '@mui/system'

const CustomTitle = styled('div')({
  position: 'relative',
  marginTop: '8px',
  marginBottom: '48px',
  flex: '1',
  color: '#151A47',
  fontSize: '30px',
  textAlign: 'center',
  '&:after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    width: '70px',
    height: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: '-12px',
    background: '#ED7465',
    borderRadius: '2px',
  },
})

interface IProps {
  title: string
}

function PageTitle(props: IProps): JSX.Element {
  const { title } = props

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${title} - Gally`
    }
  }, [title])

  return <CustomTitle>{title}</CustomTitle>
}

export default PageTitle
