import '@mui/material/styles'

declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
