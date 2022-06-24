import { FunctionComponent } from 'react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { Theme, ThemeProvider } from '@mui/material/styles'
import Head from 'next/head'
import Script from 'next/script'
import { Provider } from 'react-redux'
import { appWithTranslation } from 'next-i18next'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '~/assets/scss/style.scss'

import nextI18nConfig from '~/next-i18next.config'
import { store } from '~/store'
import RegularTheme from '~/components/atoms/RegularTheme'

/*
 * Resolve for "Prop className did not match" between Server side and Client side
 * see solution here : https://github.com/vercel/next.js/issues/7322#issuecomment-1003545233
 */

const CustomLayoutWithNoSSR = dynamic(
  () => import('~/components/organisms/layout/CustomLayout'),
  { ssr: false }
) as FunctionComponent

/*
 * Correction applied to extend Default theme from our theme actually used
 * see : https://mui.com/material-ui/guides/migration-v4/#types-property-quot-palette-quot-quot-spacing-quot-does-not-exist-on-type-defaulttheme
 */

declare module '@mui/styles/defaultTheme' {
  type DefaultTheme = Theme
}

function MyApp(props: AppProps) {
  const { pageProps } = props
  const Component = props.Component as FunctionComponent
  return (
    <>
      <Head>
        <title>Blink Admin</title>
      </Head>

      <Provider store={store}>
        <ThemeProvider theme={RegularTheme}>
          <CustomLayoutWithNoSSR>
            <Component {...pageProps} />
          </CustomLayoutWithNoSSR>
        </ThemeProvider>
      </Provider>
      <Script
        type="module"
        src="https://unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.esm.js"
      />
      <Script
        noModule
        src="https://unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.js"
      />
    </>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default appWithTranslation(MyApp, nextI18nConfig)
