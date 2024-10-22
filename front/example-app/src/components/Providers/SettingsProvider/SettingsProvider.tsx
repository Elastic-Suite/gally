import React, { ReactNode, useMemo, useState } from 'react'
import { ISettingsContext, settingsContext } from '../../../contexts'

interface IProps {
  children: ReactNode
}

function SettingsProvider({ children }: IProps): JSX.Element {
  const [longitude, setLongitude] = useState<string>('')
  const [latitude, setLatitude] = useState<string>('')

  const context = useMemo<ISettingsContext>(
    () => ({
      longitude,
      latitude,
      setLatitude,
      setLongitude,
    }),
    [longitude, latitude, setLatitude, setLongitude]
  )

  return (
    <settingsContext.Provider value={context}>
      {children}
    </settingsContext.Provider>
  )
}

export default SettingsProvider
