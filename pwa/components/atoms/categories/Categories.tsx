import { useState } from 'react'
import { styled, keyframes } from '@mui/system'
import IonIcon from '../IonIcon/IonIcon'
import Link from 'next/link'

const CustomRoot = styled('ul')({
  margin: 0,
  padding: 0,
  fontFamily: 'Inter',
  fontWeight: 500,
})

const opacity = keyframes`
from {
  opacity: 0;
}

to {
  opacity: 1;
}
`
const CustomLi = styled('li')(({ theme }) => ({
  listStyleType: 'none',
  marginLeft: theme.spacing(2),
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  opacity: 0,
  animation: `${opacity} 1000ms forwards`,
  '&:hover': {
    cursor: 'pointer',
  },
}))

const CustomTitle = styled('div')(({ theme }) => ({
  color: theme.palette.colors.secondary[600],
  position: 'relative',
  '&:hover::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '1px',
    top: '100%',
    fontSize: '12px',
    background: theme.palette.colors.secondary[600],
  },
}))

const CustomVirtual = styled('span')(({ theme }) => ({
  color: theme.palette.colors.neutral['900'],
  fontSize: '10px',
  fontWeight: 600,
  lineHeight: '12px',
  background: theme.palette.colors.neutral['300'],
  paddingTop: '2px',
  paddingBottom: '2px',
  paddingRight: '4px',
  paddingLeft: '4px',
  borderRadius: theme.spacing(1),
  marginLeft: theme.spacing(0.75),
}))

const CustomBtn = styled('span')(({ theme }) => ({
  color: theme.palette.colors.neutral['500'],
  borderRadius: '11px',
  width: '28px',
  boxSizing: 'border-box',
  height: '28px',
  fontSize: '28px',
  transition: 'transform 100ms linear',
  display: 'flex',
  justifyContent: 'center',
  padding: '2px',
  alignItems: 'center',
  '&:hover': {
    transform: 'rotate(180deg)',
    color: theme.palette.colors.secondary['600'],
    background: theme.palette.colors.secondary['100'],
  },
}))

interface IPropsItem {
  isVirtual: boolean
  name: string
  path: string
  children?: IPropsItem[]
  level: number
}

interface IProps {
  items: IPropsItem[]
}

const Categories = ({ items }: IProps) => {
  const [displayChildren, setDisplayChildren] = useState({})

  return (
    <CustomRoot>
      {items.map((item, key) => {
        return (
          <CustomLi key={key}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {item.children && (
                <CustomBtn
                  onClick={() => {
                    setDisplayChildren({
                      ...displayChildren,
                      [item.name]: !displayChildren[item.name],
                    })
                  }}
                >
                  {displayChildren[item.name] ? (
                    <IonIcon name="minus" />
                  ) : (
                    <IonIcon name="more" />
                  )}
                </CustomBtn>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CustomTitle
                  style={{
                    marginLeft: !item.children && 23.5,
                    color: item.level === 1 && '#151A47',
                  }}
                  onClick={() => {
                    setDisplayChildren({
                      ...displayChildren,
                      [item.name]: !displayChildren[item.name],
                    })
                  }}
                >
                  {!item.children ? (
                    <>
                      <Link style={{ textDecoration: 'none' }} href={item.path}>
                        {item.name}
                      </Link>
                    </>
                  ) : (
                    item.name
                  )}
                </CustomTitle>
                {item.isVirtual && <CustomVirtual>virtual</CustomVirtual>}
              </div>
            </div>
            {displayChildren[item.name] && item.children && (
              <Categories items={item.children} />
            )}
          </CustomLi>
        )
      })}
    </CustomRoot>
  )
}

export default Categories
