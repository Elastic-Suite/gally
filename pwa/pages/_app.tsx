import React from "react"
import type { AppProps } from "next/app"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "assets/scss/style.scss"
import { Theme } from "@mui/material/styles"

/*
 * Correction applied to extend Default theme from our theme actually used
 * see : https://mui.com/material-ui/guides/migration-v4/#types-property-quot-palette-quot-quot-spacing-quot-does-not-exist-on-type-defaulttheme
 */

/* eslint-disable */
declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}
/* eslint-enable */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <script
        type="module"
        src="https://unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.esm.js"
      />
      <script
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

export default MyApp
