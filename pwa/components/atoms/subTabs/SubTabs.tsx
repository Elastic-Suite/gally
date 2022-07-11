import { ReactChild, useState } from 'react'
import { styled, keyframes } from '@mui/system'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
}))

const CustumRootSubTabs = styled('div')({
  border: '1px solid #E2E6F3',
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
  minWidth: '232px',
  boxSizing: 'border-box',
  height: 'max-content',
})

const CustomSubTabs = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: 8,
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: '500',
  color: theme.palette.colors.neutral[600],
  transition: 'all 500ms',
  cursor: 'pointer',

  '&:nth-child(1)': {
    marginTop: theme.spacing(2),
  },

  '&:nth-last-child(1)': {
    marginBottom: theme.spacing(2),
  },
  '&:hover': {
    backgroundColor: theme.palette.colors.secondary[100],
  },
}))

const CustomSubTabsActive = styled(CustomSubTabs)(({ theme }) => ({
  color: theme.palette.colors.secondary[600],
  position: 'relative',
  '&::after': {
    content: "''",
    position: 'absolute',
    right: '-16px',
    top: '50%',
    transform: 'translateY(-50%)',
    height: '32px',
    width: 3,
    opacity: 0,
    background: theme.palette.menu.active,
    boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
    borderRadius: '5px 0px 0px 5px',
    animation: `${opacity} 1500ms forwards`,
  },
}))

const opacity = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

interface IProps {
  labels: string[]
  contents: ReactChild[]
}

const SubTabs = ({ labels, contents }: IProps) => {
  const [active, setActive] = useState(0)

  return (
    <CustomRoot>
      <CustumRootSubTabs>
        {labels.map((item: string, key: number) =>
          key === active ? (
            <CustomSubTabsActive key={key} onClick={() => setActive(key)}>
              {item}
            </CustomSubTabsActive>
          ) : (
            <CustomSubTabs key={key} onClick={() => setActive(key)}>
              {item}
            </CustomSubTabs>
          )
        )}
      </CustumRootSubTabs>
      {contents.map(
        (item: string, key: number) =>
          key === active && (
            <div style={{ width: '100%' }} key={key}>
              {item}
            </div>
          )
      )}
    </CustomRoot>
  )
}

export default SubTabs
