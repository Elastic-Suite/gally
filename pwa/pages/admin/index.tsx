import React from "react"
import Head from "next/head"
import { Navigate, Route } from "react-router-dom"
import {
  fetchHydra as baseFetchHydra,
  HydraAdmin,
  hydraDataProvider as baseHydraDataProvider,
  ResourceGuesser,
  useIntrospection,
} from "@api-platform/admin"
import { parseHydraDocumentation } from "@api-platform/api-doc-parser"
import authProvider from "utils/authProvider"
import { ENTRYPOINT } from "config/entrypoint"
import regularTheme from "~/components/atoms/RegularTheme"
import CustomLayout from "components/organisms/layout/CustomLayout"

const getHeaders = () =>
  localStorage.getItem(`token`)
    ? {
        Authorization: `Bearer ${localStorage.getItem(`token`)}`,
      }
    : {}

const fetchHydra = (url, options = {}) =>
  baseFetchHydra(url, {
    ...options,
    headers: getHeaders,
  })

const RedirectToLogin = () => {
  const introspect = useIntrospection()

  if (localStorage.getItem(`token`)) {
    introspect()
    return <></>
  }
  return <Navigate to="/login" replace />
}

const apiDocumentationParser = async () => {
  try {
    return await parseHydraDocumentation(ENTRYPOINT, { headers: getHeaders })
  } catch (result) {
    const { api, response, status } = result
    if (status !== 401 || !response) {
      throw result
    }

    // Prevent infinite loop if the token is expired
    localStorage.removeItem(`token`)

    return {
      api,
      response,
      status,
      customRoutes: [<Route key="/" path="/" element={<RedirectToLogin />} />],
    }
  }
}

const dataProvider = baseHydraDataProvider({
  entrypoint: ENTRYPOINT,
  httpClient: fetchHydra,
  apiDocumentationParser,
})

/* See https://marmelab.com/react-admin/Admin.html to update HydraAdmin */
const AdminLoader = () => {
  if (typeof window !== `undefined`) {
    return (
      <>
        <HydraAdmin
          dataProvider={dataProvider}
          authProvider={authProvider}
          entrypoint={window.origin}
          theme={regularTheme}
          layout={CustomLayout}
        >
          <ResourceGuesser name={`indices`} />
          <ResourceGuesser name={`documents`} />
          <ResourceGuesser name={`source_field_labels`} />
          <ResourceGuesser name={`source_field_options`} />
          <ResourceGuesser name={`metadata`} />
          <ResourceGuesser name={`source_field_option_labels`} />
          <ResourceGuesser name={`source_fields`} />
          <ResourceGuesser name={`catalogs`} />
          <ResourceGuesser name={`localized_catalogs`} />
          <ResourceGuesser name={`example_products`} />
          <ResourceGuesser name={`example_documents`} />
          <ResourceGuesser name={`example_categories`} />
          <ResourceGuesser name={`example_indices`} />
          <ResourceGuesser name={`declarative_greetings`} />
        </HydraAdmin>
      </>
    )
  }

  return <></>
}

const Admin = () => (
  <>
    <Head>
      <title>Blink Admin</title>
    </Head>

    <AdminLoader />
  </>
)
export default Admin
