/* eslint-disable @typescript-eslint/naming-convention */
import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypeBackground {
    page: string
  }

  interface Palette {
    neutral: Palette['primary']
    menu: {
      text500
      text600
      hover
      active
    }
    colors: {
      white
      black
      primary: {
        main
        100
        200
        300
        400
        500
        600
        700
        800
        900
      }
      secondary: {
        main
        100
        200
        300
        400
        500
        600
        700
        800
        900
      }
      neutral: {
        100
        200
        300
        400
        500
        600
        700
        800
        900
      }
      gradient: {
        default
        darken
      }
      shadow: {
        neutral: {
          sm
          md
          lg
        }
        primaryButton: {
          sm
          md
          lg
        }
        secondaryButton: {
          sm
          md
          lg
        }
      }
    }
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary']
    menu: {
      text500
      text600
      hover
      active
    }
    colors: {
      white
      black
      primary: {
        main
        100
        200
        300
        400
        500
        600
        700
        800
        900
      }
      secondary: {
        main
        100
        200
        300
        400
        500
        600
        700
        800
        900
      }
      neutral: {
        100
        200
        300
        400
        500
        600
        700
        800
        900
      }
      gradient: {
        default
        darken
      }
      shadow: {
        neutral: {
          sm
          md
          lg
        }
        primaryButton: {
          sm
          md
          lg
        }
        secondaryButton: {
          sm
          md
          lg
        }
      }
    }
  }
}

declare global {
  interface Window {
    showErrors?: boolean
  }
}
