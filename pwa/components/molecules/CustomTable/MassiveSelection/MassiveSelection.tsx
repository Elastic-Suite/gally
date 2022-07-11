import { Button, Checkbox, Menu, MenuItem } from '@mui/material'
import { ChangeEvent, MouseEvent, useState } from 'react'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { MassiveSelectionType } from '~/types'
import { useTranslation } from 'next-i18next'

interface IProps {
  onSelection: (selection: MassiveSelectionType) => void
  selectionState: boolean
}

function MassiveSelection(props: IProps): JSX.Element {
  const { onSelection, selectionState } = props

  const { t } = useTranslation('common')

  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleClick(e: MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(e.currentTarget)
  }

  function handleClose(key: string): void {
    const massiveSelectionType =
      MassiveSelectionType[key as keyof typeof MassiveSelectionType]
    if (massiveSelectionType) {
      onSelection(massiveSelectionType)
    }
    setAnchorEl(null)
  }

  function handleMassiveSelection(e: ChangeEvent<HTMLInputElement>): void {
    onSelection(
      e.target.checked
        ? MassiveSelectionType.ALL_ON_CURRENT_PAGE
        : MassiveSelectionType.NONE
    )
  }

  return (
    <>
      <Checkbox checked={selectionState} onChange={handleMassiveSelection} />
      <Button onClick={handleClick} color="inherit">
        <IonIcon name="chevron-down-outline" />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {Object.keys(MassiveSelectionType).map((key: string) => {
          const massiveSelectionType =
            MassiveSelectionType[key as keyof typeof MassiveSelectionType]
          return (
            <MenuItem onClick={(): void => handleClose(key)} key={key}>
              {t(massiveSelectionType)}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default MassiveSelection
