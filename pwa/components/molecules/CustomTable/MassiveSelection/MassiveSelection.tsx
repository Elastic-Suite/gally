import { Button, Checkbox, Menu, MenuItem } from '@mui/material'
import { ChangeEvent, MouseEvent, useState } from 'react'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { MassiveSelectionType } from '~/types'
import { useTranslation } from 'next-i18next'

interface IProps {
  onSelection: (selection: MassiveSelectionType) => void
  selectionState: boolean
}

const MassiveSelection = (props: IProps) => {
  const { onSelection, selectionState } = props

  const { t } = useTranslation('common')

  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = (key: string) => {
    if (MassiveSelectionType[key]) {
      onSelection(MassiveSelectionType[key])
    }
    setAnchorEl(undefined)
  }

  const handleMassiveSelection = (e: ChangeEvent<HTMLInputElement>) => {
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
        {Object.keys(MassiveSelectionType).map((key) => (
          <MenuItem onClick={() => handleClose(key)} key={key}>
            {t(MassiveSelectionType[key])}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default MassiveSelection
