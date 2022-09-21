import { useState } from 'react'
import { keyframes, styled } from '@mui/system'

import { ITab } from 'shared'

import SubTabPanel from './SubTabPanel'

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

const CustomSubTabs = styled('button')(({ theme }) => ({
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
  background: 'transparent',
  border: 0,
  textAlign: 'left',
  fontFamily: 'Inter',

  '&:nth-of-type(1)': {
    marginTop: theme.spacing(2),
  },

  '&:nth-last-of-type(1)': {
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
  defaultActiveId: number
  onChange?: (id: number) => void
  tabs: ITab[]
}

function SubTabs(props: IProps): JSX.Element {
  const { defaultActiveId, onChange, tabs } = props
  const [activeId, setActiveId] = useState(defaultActiveId)

  function handleChange(id: number): void {
    setActiveId(id)
    if (onChange) {
      onChange(id)
    }
  }

  return (
    <CustomRoot>
      <CustumRootSubTabs>
        {tabs.map(({ label, id }) =>
          id === activeId ? (
            <CustomSubTabsActive
              key={id}
              onClick={(): void => handleChange(id)}
            >
              {label}
            </CustomSubTabsActive>
          ) : (
            <CustomSubTabs key={id} onClick={(): void => handleChange(id)}>
              {label}
            </CustomSubTabs>
          )
        )}
      </CustumRootSubTabs>
      {tabs.map(({ Component, componentProps, id }) => (
        <SubTabPanel key={id} id={id} value={activeId}>
          <Component {...componentProps} active={id === activeId} />
        </SubTabPanel>
      ))}
    </CustomRoot>
  )
}

export default SubTabs
