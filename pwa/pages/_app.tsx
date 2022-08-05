import { FunctionComponent, useEffect } from 'react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Script from 'next/script'
import { appWithTranslation, useTranslation } from 'next-i18next'

import SchemaLoader from '~/components/stateful/SchemaLoader/SchemaLoader'
import nextI18nConfig from '~/next-i18next.config'
import { setLanguage, setupStore } from '~/store'

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
) as FunctionComponent

const store = setupStore()

function MyApp(props: AppProps): JSX.Element {
  const { Component, pageProps } = props
  const Cmp = Component as FunctionComponent

  const { i18n } = useTranslation('common')

  // Set language
  useEffect(() => {
    if (i18n.language) {
      setLanguage(i18n.language)
    }
  }, [i18n.language])

  return (
    <>
      <Head>
        <title>Blink Admin</title>
      </Head>

      <SchemaLoader store={store}>
        <Layout>
          <Cmp {...pageProps} />
        </Layout>
      </SchemaLoader>
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
