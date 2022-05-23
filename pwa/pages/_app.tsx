import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'assets/scss/style.scss'
import dynamic from 'next/dynamic'
import { Theme, ThemeProvider } from '@mui/material/styles'
import RegularTheme from '~/components/atoms/RegularTheme'

/*
 * Resolve for "Prop className did not match" between Server side and Client side
 * see solution here : https://github.com/vercel/next.js/issues/7322#issuecomment-1003545233
 */

const CustomLayoutWithNoSSR = dynamic(
  () => import('~/components/organisms/layout/CustomLayout'),
  { ssr: false }
)

/*
 * Correction applied to extend Default theme from our theme actually used
 * see : https://mui.com/material-ui/guides/migration-v4/#types-property-quot-palette-quot-quot-spacing-quot-does-not-exist-on-type-defaulttheme
 */

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={RegularTheme}>
        <CustomLayoutWithNoSSR>
          <Component {...pageProps} />
        </CustomLayoutWithNoSSR>
      </ThemeProvider>
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
