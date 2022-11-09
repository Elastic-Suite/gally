import { SnackbarKey } from 'notistack'

declare module 'notistack' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
}
