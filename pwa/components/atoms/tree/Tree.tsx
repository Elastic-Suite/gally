import { useState } from 'react'
import { keyframes, styled } from '@mui/system'
import IonIcon from '../IonIcon/IonIcon'

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

const CustomTitleBase = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  position: 'relative',
  '&:hover::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '1px',
    top: '100%',
    fontSize: '12px',
    background: theme.palette.colors.neutral[900],
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

const CustomLink = styled('a')({
  textDecoration: 'none',
})

interface ITreeItem {
  id: number
  isVirtual: boolean
  name: string
  path: string
  children?: ITreeItem[]
  level: number
}

interface IProps {
  data: ITreeItem[]
}

function Tree({ data }: IProps): JSX.Element {
  const [displayChildren, setDisplayChildren] = useState<
    Record<string, boolean>
  >({})

  return (
    <CustomRoot>
      {data.map((item: ITreeItem) => {
        const Title = item.level === 1 ? CustomTitleBase : CustomTitle
        return (
          <CustomLi
            style={{ marginLeft: item.level === 1 ? 0 : 30 }}
            key={item.id}
          >
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              {item.children ? (
                <CustomBtn
                  onClick={(): void => {
                    setDisplayChildren({
                      ...displayChildren,
                      [item.id]: !displayChildren[item.id],
                    })
                  }}
                >
                  {displayChildren[item.id] ? (
                    <IonIcon name="minus" />
                  ) : (
                    <IonIcon name="more" />
                  )}
                </CustomBtn>
              ) : null}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Title
                  onClick={(): void => {
                    setDisplayChildren({
                      ...displayChildren,
                      [item.id]: !displayChildren[item.id],
                    })
                  }}
                >
                  {!item.children ? (
                    <CustomLink href={item.path}>{item.name}</CustomLink>
                  ) : (
                    item.name
                  )}
                </Title>
                {item.isVirtual ? <CustomVirtual>virtual</CustomVirtual> : null}
              </div>
            </div>
            {displayChildren[item.id] && item.children ? (
              <Tree data={item.children} />
            ) : null}
          </CustomLi>
        )
      })}
    </CustomRoot>
  )
}

export default Tree
