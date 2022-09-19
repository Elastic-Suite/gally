/* eslint-disable react/destructuring-assignment */
import { HTMLAttributes, MouseEvent } from 'react'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

import { ITreeItem } from 'shared'

import Checkbox from '../form/Checkbox'
import IonIcon from '../IonIcon/IonIcon'

import {
  CustomBtn,
  CustomContainer,
  CustomLi,
  CustomRoot,
  CustomTitle,
  CustomTitleBase,
  CustomTitleContainer,
  CustomVirtual,
  SmallCustomBtn,
  SmallCustomContainer,
  Underline,
} from './Tree.styled'

function highlight(label: string, search: string): JSX.Element[] {
  const matches = match(label, search)
  const parts = parse(label, matches)
  return parts.map(
    (
      { highlight, text }: { highlight: boolean; text: string },
      index: number
    ) => {
      const Span = highlight ? Underline : 'span'
      return (
        // eslint-disable-next-line react/no-array-index-key
        <Span key={index}>{text}</Span>
      )
    }
  )
}

interface IProps<Multiple extends boolean | undefined> {
  base?: boolean
  data: ITreeItem[]
  getItemProps?: (item: ITreeItem) => HTMLAttributes<HTMLLIElement>
  getListboxProps?: () => HTMLAttributes<HTMLUListElement>
  multiple?: Multiple
  onChange?: Multiple extends true
    ? (item?: ITreeItem[]) => void
    : (item?: ITreeItem) => void
  onToggle?: (items: Record<string, boolean>) => void
  openItems?: Record<string, boolean>
  search?: string
  small?: boolean
  value?: Multiple extends true ? ITreeItem[] : ITreeItem
}

function Tree<Multiple extends boolean | undefined>(
  props: IProps<Multiple>
): JSX.Element {
  const {
    base = true,
    data,
    getItemProps,
    getListboxProps,
    multiple,
    onChange,
    onToggle,
    openItems,
    search,
    small,
    value,
  } = props

  const Title = base ? CustomTitleBase : CustomTitle
  const Container = small ? SmallCustomContainer : CustomContainer
  const Button = small ? SmallCustomBtn : CustomBtn

  function handleClick(event: MouseEvent<HTMLUListElement>): void {
    event.stopPropagation()
  }

  function handletoggle(item: ITreeItem) {
    return (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation()
      onToggle({
        ...openItems,
        [item.id]: !openItems[item.id],
      })
    }
  }

  function handleChecked(item: ITreeItem) {
    return (): void => {
      if (onChange) {
        if (multiple) {
          const onChange = props.onChange as (item?: ITreeItem[]) => void
          const value = props.value as ITreeItem[]
          const checked = value.includes(item)
          checked
            ? onChange(value.filter((val) => val !== item))
            : onChange(value.concat(item))
        } else {
          const onChange = props.onChange as (item?: ITreeItem) => void
          const value = props.value as ITreeItem
          const checked = value === item
          checked ? onChange() : onChange(item)
        }
      }
    }
  }

  return (
    <CustomRoot onClick={handleClick} {...(base && getListboxProps?.())}>
      {data.map((item: ITreeItem) => {
        const title = (
          <Title onClick={handleChecked(item)}>
            {search ? (
              highlight(item.name, search)
            ) : !(value instanceof Array) && value === item ? (
              <Underline>{item.name}</Underline>
            ) : (
              item.name
            )}
          </Title>
        )
        return (
          <CustomLi
            key={item.id}
            {...getItemProps?.(item)}
            style={{ marginLeft: base ? 0 : small ? 12 : 20 }}
          >
            <Container
              style={{
                marginLeft: item.children ? 0 : small ? 19 : 28,
              }}
            >
              {item.children ? (
                <Button onClick={handletoggle(item)}>
                  <IonIcon
                    name={openItems[item.id] ? 'minus' : 'more'}
                    style={{ fontSize: small ? '15px' : '24px' }}
                  />
                </Button>
              ) : null}
              <CustomTitleContainer>
                {multiple ? (
                  <Checkbox
                    checked={
                      value instanceof Array
                        ? value.includes(item)
                        : value === item
                    }
                    label={title}
                    list
                    onChange={handleChecked(item)}
                    small={small}
                  />
                ) : (
                  title
                )}
                {item.isVirtual ? <CustomVirtual>virtual</CustomVirtual> : null}
              </CustomTitleContainer>
            </Container>
            {Boolean(openItems[item.id] && item.children) && (
              <Tree {...props} base={false} data={item.children} />
            )}
          </CustomLi>
        )
      })}
    </CustomRoot>
  )
}

Tree.defaultProps = {
  base: true,
  openItems: {},
}

export default Tree
