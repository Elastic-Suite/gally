import type { AppProps /*, AppContext */ } from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'assets/scss/style.scss'

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
