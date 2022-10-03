import { createTheme } from '@mui/material/styles'
import { keyframes } from '@emotion/react'

export const buttonEnterKeyframe = keyframes`
    0% {
      transform: scale(0);
      opacity: 0.3;
    }
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
  `

/* Creation of custom light theme
 * There is always scss assets to scss modifications but here is to be used by Material UI
 * see : https://mui.com/customization/theming/
 */
export const theme = createTheme({
  palette: {
    background: {
      page: '#FAFBFE',
    },
    primary: {
      light: '#FBC0B9',
      main: '#ED7465',
      dark: '#A02213',
    },
    secondary: {
      light: '#BABDFC',
      main: '#2C19CD',
      dark: '#1812A0',
    },
    neutral: {
      light: '#F4F7FF',
      main: '#B5B9D9',
      dark: '#2F3674',
      contrastText: '#FFFFFF',
    },
    error: {
      light: '#FFE7E4',
      main: '#A02213',
    },
    warning: {
      light: '#FEF9D0',
      main: '#60590D',
    },
    success: {
      light: '#E7F4EC',
      main: '#18753C',
    },
    menu: {
      text500: '#424880',
      text600: '#212250',
      hover: '#E7E8FF',
      active: '#2C19CD',
    },
    colors: {
      white: '#FFF',
      black: '#000',
      primary: {
        main: '#ED7465',
        100: '#FFE7E4',
        200: '#FBC0B9',
        300: '#F3978C',
        400: '#ED7465',
        500: '#E64733',
        600: '#CC2D19',
        700: '#A02213',
        800: '#73170C',
        900: '#460C05',
      },
      secondary: {
        main: '#2C19CD',
        100: '#E7E8FF',
        200: '#BABDFC',
        300: '#8D8DF3',
        400: '#6460ED',
        500: '#3F32E6',
        600: '#2C19CD',
        700: '#1812A0',
        800: '#0D1274',
        900: '#070F47',
      },
      neutral: {
        100: '#FAFBFE',
        200: '#F4F7FF',
        300: '#E2E6F3',
        400: '#B5B9D9',
        500: '#8187B9',
        600: '#424880',
        700: '#2F3674',
        800: '#212250',
        900: '#151A47',
      },
      gradient: {
        default: 'linear-gradient(46.78deg, #E64733 1.79%, #ED7465 98.88%)',
        darken: 'linear-gradient(46.78deg, #CC2D19 1.79%, #E64733 98.88%)',
      },
      shadow: {
        neutral: {
          sm: '4px 4px 14px rgba(226, 230, 243, 0.5)',
          md: '0px -8px 8px rgba(226, 230, 243, 0.2), 0px 5px 8px rgba(107, 113, 166, 0.1), 4px 4px 14px rgba(226, 230, 243, 0.5)',
          lg: '0px -8px 8px rgba(226, 230, 243, 0.2), 0px 8px 8px rgba(107, 113, 166, 0.2), 4px 4px 14px rgba(226, 230, 243, 0.5)',
        },
        primaryButton: {
          sm: '0px -8px 8px rgba(255, 231, 228, 0.2), 0px 8px 8px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)',
          md: '0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 16px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)',
          lg: '0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 36px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)',
        },
        secondaryButton: {
          sm: '0px -8px 8px rgba(231, 232, 255, 0.2), 0px 8px 8px rgba(186, 189, 252, 0.05), 4px 4px 14px rgba(231, 232, 255, 0.5)',
          md: '0px -8px 8px rgba(231, 232, 255, 0.2), 0px 16px 16px rgba(186, 189, 252, 0.2), 4px 4px 14px rgba(231, 232, 255, 0.5)',
          lg: '0px -8px 8px rgba(231, 232, 255, 0.2), 0px 16px 36px rgba(186, 189, 252, 0.4), 4px 4px 14px rgba(231, 232, 255, 0.5)',
        },
      },
    },
    mode: 'light',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontSize: 36,
      lineHeight: '44px',
      fontWeight: 600,
    },
    h2: {
      fontSize: 28,
      lineHeight: '38px',
      fontWeight: 600,
    },
    h3: {
      fontSize: 24,
      lineHeight: '32px',
      fontWeight: 600,
    },
    h4: {
      fontSize: 20,
      lineHeight: '30px',
      fontWeight: 600,
    },
    h5: {
      fontSize: 18,
      lineHeight: '28px',
      fontWeight: 600,
    },
    h6: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 600,
    },
    body1: {
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 500,
    },
    body2: {
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 400,
    },
    caption: {
      fontSize: 12,
      lineHeight: '18px',
      fontWeight: 400,
    },
  },
  components: {
    MuiCollapse: {
      styleOverrides: {
        wrapper: {
          width: '100%',
        },
        wrapperInner: {
          width: '100%',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 32,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          transform: 'scale(0.9)',
          color: '#B5B9D9',
          transition: 'all 0.3s linear',
          '&:hover': {
            backgroundColor: 'rgba(21, 26, 71, 0.08)',
          },
          '&:focus': {
            backgroundColor: 'rgba(21, 26, 71, 0.12)',
          },
          '.MuiTouchRipple-child': {
            backgroundColor: 'rgba(21, 26, 71)',
          },
          '&.Mui-checked, &.MuiCheckbox-indeterminate': {
            '&:hover': {
              backgroundColor: 'rgba(237, 116, 101, 0.08)',
            },
            '&:focus': {
              backgroundColor: 'rgba(237, 116, 101, 0.12)',
            },
            '.MuiTouchRipple-child': {
              backgroundColor: 'rgba(237, 116, 101)',
            },
          },
          '&.Mui-disabled': {
            color: '#E2E6F3',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          transform: 'scale(0.9)',
          color: '#B5B9D9',
          transition: 'all 0.3s linear',
          '&:hover': {
            backgroundColor: 'rgba(21, 26, 71, 0.08)',
          },
          '&:focus': {
            backgroundColor: 'rgba(21, 26, 71, 0.12)',
          },
          '.MuiTouchRipple-child': {
            backgroundColor: 'rgba(21, 26, 71)',
          },
          '&.Mui-checked': {
            '&:hover': {
              backgroundColor: 'rgba(237, 116, 101, 0.08)',
            },
            '&:focus': {
              backgroundColor: 'rgba(237, 116, 101, 0.12)',
            },
            '.MuiTouchRipple-child': {
              backgroundColor: 'rgba(237, 116, 101)',
            },
          },
          '&.Mui-disabled': {
            color: '#E2E6F3',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          background: '#FFF',
          border: '1px solid #B5B9D9',
          boxSizing: 'border-box',
          boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.05)',
          borderRadius: '22px',
          width: '19px',
          height: '19px',
        },
        track: {
          backgroundColor: '#B5B9D9',
          borderRadius: '22px',
          opacity: '1',
          height: '13px',
        },
        switchBase: {
          transition: 'all 0.3s linear',
          '&:hover': {
            backgroundColor: 'rgba(21, 26, 71, 0.08)',
          },
          '&:focus': {
            backgroundColor: 'rgba(21, 26, 71, 0.12)',
          },
          '.MuiTouchRipple-child': {
            backgroundColor: 'rgba(21, 26, 71)',
          },
          '&.Mui-checked': {
            '&:hover': {
              backgroundColor: 'rgba(237, 116, 101, 0.08)',
            },
            '&:focus': {
              backgroundColor: 'rgba(237, 116, 101, 0.12)',
            },
            '.MuiTouchRipple-child': {
              backgroundColor: 'rgba(237, 116, 101)',
            },
            '& .MuiSwitch-thumb': {
              border: '0',
              background:
                'linear-gradient(46.78deg, #E64733 1.79%, #ED7465 98.88%)',
              boxShadow: '0px 6px 10px rgba(237, 116, 101, 0.1)',
            },
            '& + .MuiSwitch-track': {
              backgroundColor: '#E64733',
              opacity: '0.2',
            },
          },
          '&.Mui-disabled': {
            '+ .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: 'rgba(181, 185, 217, 0.3)',
            },
            '& .MuiSwitch-thumb': {
              border: '1px solid rgba(181, 185, 217, 0.3)',
            },
            '&.Mui-checked': {
              '+ .MuiSwitch-track': {
                opacity: 0.2,
                backgroundColor: 'rgba(230, 71, 51, 0.3)',
              },
              '& .MuiSwitch-thumb': {
                boxShadow: 'none',
                opacity: 0.3,
              },
            },
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          color: '#FFF',
          fontSize: '26px',
          background:
            'linear-gradient(46.78deg, #E64733 1.79%, #ED7465 98.88%)',
          boxShadow:
            '0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 16px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)',
          width: '56px',
          height: '56px',
          zIndex: 1,
          '&::before': {
            position: 'absolute',
            content: '""',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: '50%',
            background:
              'linear-gradient(46.78deg, #CC2D19 1.79%, #E64733 98.88%)',
            boxShadow:
              '0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 36px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)',
            zIndex: -1,
            transition: 'opacity 0.3s linear',
            opacity: 0,
          },
          '&:hover::before': {
            opacity: 1,
          },
          '&:hover': {
            background:
              'linear-gradient(46.78deg, #E64733 1.79%, #ED7465 98.88%)',
            boxShadow:
              '0px -8px 8px rgba(255, 231, 228, 0.2), 0px 16px 16px rgba(243, 151, 140, 0.2), 4px 4px 14px rgba(255, 231, 228, 0.5)',
          },
          '&& .MuiTouchRipple-child': {
            backgroundColor: '#CC2D19',
            opacity: 1,
          },
          '&& .MuiTouchRipple-rippleVisible': {
            animationName: `${buttonEnterKeyframe}`,
          },
          '&.Mui-disabled': {
            color: '#8187B9',
            background: '#E2E6F3',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          color: '#151A47',
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 400,
        },
        label: {
          '&.Mui-disabled': {
            color: '#8187B9',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          WebkitTransform: 'none',
          transform: 'none',
          fontWeight: 500,
          lineHeight: '20px',
          color: '#151A47',
          '&.Mui-focused': {
            color: '#151A47',
          },
        },
        shrink: {
          fontSize: 14,
          color: '#151A47',
        },
        asterisk: {
          color: '#CC2D19',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          display: 'flex',
          color: '#424880',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '18px',
          margin: '8px 0 0 0',
          '.MuiInputBase-colorSuccess + &': {
            color: '#18753C',
          },
          '.MuiInputBase-colorError + &, .textarea--error + &': {
            color: '#A02213',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          textarea: {
            fontFamily: 'Inter',
            borderColor: '#E2E6F3',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderRadius: 8,
            background: '#FFF',
            color: '#151A47',
            fontWeight: 400,
            fontSize: 14,
            lineHeight: '20px',
            padding: 16,
            transition: 'border-color 0.3s linear',
            '&:hover': {
              borderColor: '#B5B9D9',
            },
            '&.textarea--filled': {
              borderColor: '#B5B9D9',
            },
            '&:focus': {
              borderColor: '#424880',
            },
            '&.textarea--error': {
              borderColor: '#A02213',
            },
            '&:disabled': {
              pointerEvents: 'none',
              color: '#424880',
              background: '#E2E6F3',
              borderColor: '#E2E6F3',
            },
            '&:focus-visible': {
              outline: 'none',
            },
            '&::placeholder': {
              fontFamily: 'Inter',
              color: '#424880',
              opacity: 1,
            },
            '&::-webkit-resizer': {
              background: `no-repeat 100% 100%/150% url(/images/corner-expand.svg)`,
            },
          },
          'label + textarea': {
            marginTop: 24,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          padding: 32,
          width: '600px',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: 'rgba(21, 26, 71, 0.6)',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          '> :not(:first-of-type)': {
            marginLeft: 0,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '500',
          color: '#424880',
          '&.Mui-selected': { color: '#2C19CD' },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#2C19CD' },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#FFF',
          color: '#151A47',
          fontSize: '12px',
          fontFamily: 'Inter',
          fontWeight: '400',
          lineHeight: '18px',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        },
        arrow: {
          color: '#FFF',
        },
      },
    },
  },
})
