import {
  IConfigurations,
  IHydraResponse,
} from '@elastic-suite/gally-admin-shared'
import { ReactNode } from 'react'
import { useFetchApi } from '../../../hooks'

import { configurationsContext } from '../../../contexts'

interface IProps {
  children: ReactNode
}

function ConfigurationsProvider(props: IProps): JSX.Element {
  const { children } = props

  const [configurations] = useFetchApi<IHydraResponse<IConfigurations>>(
    '/public_configurations'
  )

  const value =
    configurations?.data &&
    Object.fromEntries(
      configurations.data['hydra:member'].map((configuration) => [
        configuration.path,
        configuration.value,
      ])
    )

  return (
    <configurationsContext.Provider value={value}>
      {children}
    </configurationsContext.Provider>
  )
}

export default ConfigurationsProvider
