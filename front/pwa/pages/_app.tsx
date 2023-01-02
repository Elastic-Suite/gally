import React from 'react'
import { Inter } from '@next/font/google'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head'
import { GallyApp, nextI18nConfig } from 'gally-admin-components'

// eslint-disable-next-line new-cap
const inter = Inter({
  subsets: ['latin'],
  variable: '--gally-font',
})

function App(props: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Gally Admin</title>
      </Head>
      <main className={inter.variable}>
        <GallyApp {...props} />
      </main>
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

export default appWithTranslation(App, nextI18nConfig)
