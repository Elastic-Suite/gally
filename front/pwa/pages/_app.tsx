import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import Head from 'next/head'

import nextI18nConfig from '~/next-i18next.config'
import { setupStore } from '~/store'

import AppProvider from '~/components/stateful-providers/AppProvider/AppProvider'
import DataProvider from '~/components/stateful-providers/DataProvider/DataProvider'

import 'assets/scss/style.scss'

/*
 * Resolve for "Prop className did not match" between Server side and Client side
 * see solution here : https://github.com/vercel/next.js/issues/7322#issuecomment-1003545233
 */
const Layout = dynamic(
  () => import('~/components/stateful-layout/Layout/Layout'),
  {
    ssr: false,
  }
)

const store = setupStore()

function MyApp(props: AppProps): JSX.Element {
  const { Component, pageProps } = props
  const Cmp = Component

  return (
    <>
      <Head>
        <title>Blink Admin</title>
      </Head>
      <AppProvider store={store}>
        <DataProvider>
          <Layout>
            <Cmp {...pageProps} />
          </Layout>
        </DataProvider>
      </AppProvider>
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
