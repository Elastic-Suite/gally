import { useState } from 'react'
import IonIcon from '../IonIcon/IonIcon'
import { ITreeItem } from '~/types/categories'
import {
  CustomBtn,
  CustomContainer,
  CustomLi,
  CustomRoot,
  CustomTitle,
  CustomTitleBase,
  CustomTitleBaseSelected,
  CustomTitleContainer,
  CustomTitleSelected,
  CustomVirtual,
} from './Tree.styled'

interface IProps {
  data: ITreeItem[]
  base?: boolean
  selectedItem?: ITreeItem
  onSelect?: (item: ITreeItem) => void
}

function Tree({
  data,
  base = true,
  selectedItem,
  onSelect,
}: IProps): JSX.Element {
  const [displayChildren, setDisplayChildren] = useState<
    Record<string, boolean>
  >({})

  return (
    <CustomRoot>
      {data.map((item: ITreeItem) => {
        const selected = base ? CustomTitleBaseSelected : CustomTitleSelected
        const unselected = base ? CustomTitleBase : CustomTitle
        const Title = selectedItem?.id === item.id ? selected : unselected

        return (
          <CustomLi
            style={{ marginLeft: base ? 0 : 20 }}
            key={item.catalogCode ? item.catalogCode : item.id}
          >
            <CustomContainer
              style={{
                marginLeft: item.categories ? 0 : item.children ? 0 : 28,
              }}
            >
              {item.children || item.categories ? (
                <CustomBtn
                  onClick={(): void => {
                    setDisplayChildren({
                      ...displayChildren,
                      [item.id]: !displayChildren[item.id],
                    })
                  }}
                >
                  <IonIcon name={displayChildren[item.id] ? 'minus' : 'more'} />
                </CustomBtn>
              ) : null}
              <CustomTitleContainer>
                <Title
                  onClick={(): void => {
                    onSelect(item)
                  }}
                >
                  {!item.catalogName ? item.name : item.catalogName}
                </Title>
                {item.isVirtual ? <CustomVirtual>virtual</CustomVirtual> : null}
              </CustomTitleContainer>
            </CustomContainer>
            {displayChildren[item.id] && (item.children || item.categories) ? (
              <Tree
                data={item.categories ? item.categories : item.children}
                selectedItem={selectedItem}
                onSelect={onSelect}
                base={false}
              />
            ) : null}
          </CustomLi>
        )
      })}
    </CustomRoot>
  )
}

export default Tree
