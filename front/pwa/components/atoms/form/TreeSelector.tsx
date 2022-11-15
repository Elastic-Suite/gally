import {
  ChangeEvent,
  HTMLAttributes,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { IconButtonProps, Popper, useAutocomplete } from '@mui/material'
import { useTranslation } from 'next-i18next'
import classNames from 'classnames'

import { ITreeItem } from 'shared'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import Chip from '../Chip/Chip'
import Tree from '../tree/Tree'

import { SmallStyledPaper, StyledPaper } from './DropDown.styled'
import { IInputTextProps } from './InputText'
import {
  AutocompleteClearIndicator,
  AutocompletePopupIndicator,
  EndAdornment,
  IAutocompletePopupIndicatorProps,
  Input,
  Root,
  TreeContainer,
} from './TreeSelector.styled'

function flatTree(tree: ITreeItem[], flat: ITreeItem[]): void {
  tree.forEach((item) => {
    flat.push(item)
    if (item.children) {
      flatTree(item.children, flat)
    }
  })
}

interface IProps extends Omit<IInputTextProps, 'onChange' | 'value' | 'ref'> {
  data: ITreeItem[]
  limitTags?: number
  onChange?: (value: (string | number)[]) => void
  value: (string | number)[]
}

function TreeSelector(props: IProps): JSX.Element {
  const {
    data,
    limitTags,
    onChange: onChangeProps,
    value: valueProp,
    style,
    ...other
  } = props
  const { t } = useTranslation('common')
  const [search, setSearch] = useState('')
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const options: ITreeItem[] = useMemo(() => {
    const flat: ITreeItem[] = []
    flatTree(data, flat)
    return flat
  }, [data])
  const getOptionLabel = useCallback((option: ITreeItem) => option.name, [])
  const filterOptions = useCallback((options: ITreeItem[]) => options, [])
  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
    []
  )

  const { disabled, readOnly, small } = other
  const {
    getClearProps,
    getInputProps,
    getPopupIndicatorProps,
    getRootProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    value,
    dirty,
    id,
    popupOpen,
    focused,
    anchorEl,
    setAnchorEl,
  } = useAutocomplete({
    ...other,
    autoComplete: false,
    componentName: 'TreeSelector',
    defaultValue: [],
    disableCloseOnSelect: true,
    filterOptions,
    getOptionLabel,
    multiple: true,
    onInputChange,
    options,
  })

  const getItemProps = useCallback(
    (item: ITreeItem): HTMLAttributes<HTMLLIElement> => {
      const index = options.indexOf(item)
      return getOptionProps({ option: item, index })
    },
    [getOptionProps, options]
  )
  const getCustomizedTagProps = useCallback(
    (params: {
      index: number
    }): {
      key: number
      'data-tag-index': number
      disabled: boolean
      tabIndex: -1
      onDelete: (event: SyntheticEvent) => void
    } => ({
      disabled,
      ...getTagProps(params),
    }),
    [disabled, getTagProps]
  )

  const hasClearIcon = !disabled && dirty && !readOnly
  const Paper = small ? SmallStyledPaper : StyledPaper
  const clearText = t('form.clear')
  const closeText = t('form.close')
  const openText = t('form.open')

  let startAdornment = value.map((option: ITreeItem, index: number) => (
    <Chip
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      label={getOptionLabel(option)}
      size={small ? 'small' : 'medium'}
      {...getCustomizedTagProps({ index })}
    />
  ))
  if (limitTags > -1 && Array.isArray(startAdornment)) {
    const more = startAdornment.length - limitTags
    if (!focused && more > 0) {
      startAdornment = startAdornment.splice(0, limitTags)
      startAdornment.push(<span key={startAdornment.length}>+{more}</span>)
    }
  }

  return (
    <Root {...getRootProps()} style={style}>
      <Input
        {...other}
        className={classNames({ focused, hasClearIcon })}
        endAdornment={
          <EndAdornment position="end">
            {Boolean(hasClearIcon) && (
              <AutocompleteClearIndicator
                {...(getClearProps() as unknown as IconButtonProps)}
                aria-label={clearText}
                className="AutocompleteClearIndicator"
                title={clearText}
              >
                <IonIcon name="close" />
              </AutocompleteClearIndicator>
            )}
            <AutocompletePopupIndicator
              {...(getPopupIndicatorProps() as unknown as IAutocompletePopupIndicatorProps)}
              aria-label={popupOpen ? closeText : openText}
              disabled={disabled}
              popupOpen={popupOpen}
              title={popupOpen ? closeText : openText}
            >
              <IonIcon name="chevron-down" />
            </AutocompletePopupIndicator>
          </EndAdornment>
        }
        id={id}
        inputProps={getInputProps()}
        ref={setAnchorEl}
        startAdornment={startAdornment}
      />
      {Boolean(anchorEl) && (
        <Popper
          role="presentation"
          anchorEl={anchorEl}
          open={popupOpen}
          placement="bottom-start"
        >
          <Paper>
            <TreeContainer>
              <Tree
                data={data}
                getItemProps={getItemProps}
                getListboxProps={getListboxProps}
                multiple
                onToggle={setOpenItems}
                openItems={openItems}
                search={search}
                small={small}
                value={value as ITreeItem[]}
              />
            </TreeContainer>
          </Paper>
        </Popper>
      )}
    </Root>
  )
}

TreeSelector.defaultProps = {
  limitTags: 2,
}

export default TreeSelector
