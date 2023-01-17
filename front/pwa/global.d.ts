/* eslint-disable @typescript-eslint/naming-convention */
import '@elastic-suite/gally-admin-shared'
import { SnackbarKey } from 'notistack'

declare module 'notistack' {
  interface VariantOverrides {
    error: {
      onShut: (id: SnackbarKey) => void
    }
    info: {
      onShut: (id: SnackbarKey) => void
    }
    success: {
      onShut: (id: SnackbarKey) => void
    }
    warning: {
      onShut: (id: SnackbarKey) => void
    }
  }

  interface OptionsObject {
    onShut: (key?: SnackbarKey) => void
    variant: MessageSeverity
  }
}
