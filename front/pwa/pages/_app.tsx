import React from 'react'
import { Inter } from '@next/font/google'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import '@elastic-suite/gally-admin-components/dist/style.css'

// eslint-disable-next-line new-cap
const inter = Inter({
  subsets: ['latin'],
  variable: '--gally-font',
})

const GallyApp = dynamic(
  () =>
    import('@elastic-suite/gally-admin-components').then((mod) => mod.GallyApp),
  {
    ssr: false,
  }
)

function App(props: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Gally Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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

export default App
