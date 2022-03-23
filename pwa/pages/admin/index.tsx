import Head from "next/head";
import { Redirect, Route } from "react-router-dom";
import {
  fetchHydra as baseFetchHydra,
  hydraDataProvider as baseHydraDataProvider,
  useIntrospection,
} from "@api-platform/admin";
import { parseHydraDocumentation } from "@api-platform/api-doc-parser";
import authProvider from "utils/authProvider";
import { ENTRYPOINT } from "config/entrypoint";
import { HydraAdmin, ResourceGuesser } from "@api-platform/admin";

import CatalogEdit from "../../components/CatalogEdit";
import CatalogsList from "../../components/CatalogsList";
import CustomLayout from "../../components/CustomLayout";
import customRoutes from '../../customRoutes';

const getHeaders = () => localStorage.getItem("token") ? {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
} : {};

const fetchHydra = (url, options = {}) =>
  baseFetchHydra(url, {
    ...options,
    headers: getHeaders,
  });

const RedirectToLogin = () => {
  const introspect = useIntrospection();

  if (localStorage.getItem("token")) {
    introspect();
    return <></>;
  }
  return <Redirect to="/login" />;
};

const apiDocumentationParser = async () => {
  try {
    return await parseHydraDocumentation(ENTRYPOINT, { headers: getHeaders });
  } catch (result) {
    const { api, response, status } = result;
    if (status !== 401 || !response) {
      throw result;
    }

    // Prevent infinite loop if the token is expired
    localStorage.removeItem("token");

    return {
      api,
      response,
      status,
      customRoutes: [
        <Route key="/" path="/" component={RedirectToLogin} />
      ],
    };
  }
};

const dataProvider = baseHydraDataProvider({
  entrypoint: ENTRYPOINT,
  httpClient: fetchHydra,
  apiDocumentationParser,
});

const AdminLoader = () => {
  if (typeof window !== "undefined") {
    // const { HydraAdmin } = require("@api-platform/admin");
    // return <HydraAdmin dataProvider={dataProvider} authProvider={authProvider} entrypoint={window.origin} />;
    return (
      <HydraAdmin customRoutes={customRoutes} dataProvider={dataProvider} authProvider={authProvider} entrypoint={window.origin} layout={CustomLayout}>
        <ResourceGuesser name={"example_documents"} />
        <ResourceGuesser name={"example_products"} />
        <ResourceGuesser name={"example_categories"} />
        <ResourceGuesser name={"example_indices"} />
        <ResourceGuesser name={"indices"} />
        <ResourceGuesser name={"source_field_options"} />
        <ResourceGuesser name={"documents"} />
        <ResourceGuesser name={"source_fields"} />
        <ResourceGuesser name={"source_field_option_labels"} />
        <ResourceGuesser name={"metadata"} />
        <ResourceGuesser name={"source_field_labels"} />
        <ResourceGuesser name={"catalogs"} list={CatalogsList} edit={CatalogEdit} />
        <ResourceGuesser name={"localized_catalogs"} />
        <ResourceGuesser name={"greetings"} />
        <ResourceGuesser name={"declarative_greetings"} />
      </HydraAdmin>
    )
  }

  return <></>;
};

const Admin = () => (
  <>
    <Head>
      <title>API Platform Admin</title>
    </Head>

    <AdminLoader />
  </>
);
export default Admin;
