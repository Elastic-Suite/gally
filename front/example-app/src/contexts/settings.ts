import { Dispatch, SetStateAction, createContext } from 'react'

export interface ISettingsContext {
  longitude: string
  latitude: string
  setLongitude: Dispatch<SetStateAction<ISettingsContext['longitude']>>
  setLatitude: Dispatch<SetStateAction<ISettingsContext['latitude']>>
}

export const settingsContext = createContext<ISettingsContext>(null)
