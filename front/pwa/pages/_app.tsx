import React from 'react'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
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
      {/* eslint-disable react/no-unknown-property*/}
      <style jsx global>{`
        body {
          font-family: ${inter.style.fontFamily};
          --gally-font: ${inter.style.fontFamily};
        }
      `}</style>
      <Head>
        <title>Gally Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main>
        <GallyApp {...props} />
      </main>
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
